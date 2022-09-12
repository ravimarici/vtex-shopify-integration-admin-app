import React, { Component, Fragment, useState } from 'react'
import {
  Table,
  Input,
  Tag,
  Spinner
} from 'vtex.styleguide'
import faker from 'faker'
import { withRuntimeContext,useRuntime  } from 'vtex.render-runtime'
import {useQuery,useMutation} from 'react-apollo'
import getSellers from '../graphql/getSellers.graphql'
import AddSeller from '../Modals/AddSeller'
import syncProductsWithMarketplace from '../graphql/syncProductsWithMarketplace.graphql'
import syncInventoryWithMarketplace from '../graphql/syncInventoryWithMarketplace.graphql'

type Props = {}

const EXAMPLE_LENGTH = 5
const MOCKED_DATA = [...Array(EXAMPLE_LENGTH)].map(() => ({
  sellerName: faker.name.findName(),
  sellerEmail: faker.address.streetAddress(),
  sellerAddress: `${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`,
  storeName: faker.internet.email().toLowerCase(),
  color:faker.commerce.color().toString()
}))
const getSchema=() =>{
  const { tableDensity }: any ="low"

  let fontSize = 'f5'

  switch (tableDensity) {
    case 'low': {
      fontSize = 'f5'
      break
    }
    case 'medium': {
      fontSize = 'f6'
      break
    }
    case 'high': {
      fontSize = 'f7'
      break
    }
    default: {
      fontSize = 'f5'
      break
    }
  }
  return {
    properties: {
      sellerName: {
        title: 'Seller Name',
      },
      sellerEmail: {
        title: 'Seller Email',
        cellRenderer: ({ cellData }: any) => {
          return <span className="ws-normal">{cellData}</span>
        },
      },
      sellerAddress: {
        title: 'Seller Address',
        cellRenderer: ({ cellData }: any) => {
          return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
        },
      },
      storeName: {
        title: 'Seller Store Name',
        cellRenderer: ({ cellData }: any) => {
          return <span className={`ws-normal ${fontSize}`}>{cellData}</span>
        },
      }
      // ,
      // color: {
      //   title: 'Color',
      //   // you can customize cell component render (also header component with headerRenderer)
      //   cellRenderer: ({ cellData }: any) => {
      //     return (
      //       <Tag
      //         bgColor={cellData.color}
      //         color="#fff"
      //         onClick={(e:any) => {
      //           // if you use cellRender click event AND onRowclick event
      //           // you should stop the event propagation so the cell click fires and row click don't
      //           e.stopPropagation()
      //           alert(
      //             `you just clicked a cell to remove ${cellData.label}, HEX: ${cellData.color}`
      //           )
      //         }}>
      //         <span className="nowrap">{cellData.label}</span>
      //       </Tag>
      //     )
      //   },
      // },
    },
  }
}



const simpleInputObject=({ values, onChangeObjectCallback }: any) => {
  return (
    <Input
      value={values || ''}
      onChange={(e: any) => onChangeObjectCallback(e.target.value)}
    />
  )
}

const simpleInputVerbsAndLabel=()=> {
  return {
    renderFilterLabel: (st: any) => {
      if (!st || !st.object) {
        // you should treat empty object cases only for alwaysVisibleFilters
        return 'Any'
      }
      return `${
        st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
      } ${st.object}`
    },
    verbs: [
      {
        label: 'is',
        value: '=',
        object: {
          renderFn: simpleInputObject,
          extraParams: {},
        },
      },
      {
        label: 'is not',
        value: '!=',
        object: {
          renderFn: simpleInputObject,
          extraParams: {},
        },
      },
      {
        label: 'contains',
        value: 'contains',
        object: {
          renderFn: simpleInputObject,
          extraParams: {},
        },
      },
    ],
  }
}

interface searchValue{
  searchValue?:string | null
}
interface filterStatements{
  filterStatements:string | null
}
const Tables = (props: Props) => {
  const [items,setItems] = useState(MOCKED_DATA)
  const {data,loading,error} = useQuery(getSellers,{
    variables:{
      sellerId:"",
      size:10
    },
    ssr:false,
    onCompleted:(()=>{setItems(data?.getSellers)})
  })
  const [tableDensity,setTableDensity] = useState({tableDensity:"low"})
  const { navigate } = useRuntime()
  const [searchValue,setSearchValue] = useState<searchValue>()
  const [filterStatements,setFilterStatements] = useState<filterStatements>()
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false)
  const [syncProducts,{loading:loadingSync}] = useMutation(syncProductsWithMarketplace)
  const [syncInventory,{loading:loadingSyncInventory}] = useMutation(syncInventoryWithMarketplace)


  const addNewSeller = () => {
    setIsAddSellerOpen(true)
  }
  const closeModalAddSeller = () => {
    setIsAddSellerOpen(false)
  }

  const lineActions = [
    {
      label: ({ rowData }:{rowData:any}) => `Sync Products for ${rowData.sellerName}`,
      onClick: ({ rowData }:{rowData:any}) => {
        syncProducts({
        variables:{
          apiKey:rowData.apiKey,
          apiPassword:rowData.apiPassword,
          shopifyStoreName:rowData.storeName
        }
      }).then(()=>{
        alert('Completed')
      })
    },
    },
    {
      label: ({ rowData }:{rowData:any}) => `Sync Inventory for ${rowData.sellerName}`,
      onClick: ({ rowData }:{rowData:any}) => {
        console.log(rowData)
        syncInventory({
        variables:{
          apiKey:rowData.apiKey,
          apiPassword:rowData.apiPassword,
          shopifyStoreName:rowData.storeName,
          sellerId:rowData.sellerId
        }
      }).then(()=>{
        alert('Completed Inventory Sync')
      })
    },
    }

  ]
  return (
    <div>
    <Table
      fullWidth
      updateTableKey={tableDensity}
      items={loading? []:items}
      emptyStateLabel="Nothing to show"
      emptyStateChildren={
        <React.Fragment>
          <Spinner/>
        </React.Fragment>
      }
      schema={getSchema()}
      density="low"
      lineActions={lineActions}
      onRowClick={({ rowData }: any) =>
        navigate({
          page: 'admin.app.example-detail',
          params: { id: rowData.id },
        })
      }

      toolbar={{
        density: {
          buttonLabel: 'Line density',
          lowOptionLabel: 'Low',
          mediumOptionLabel: 'Medium',
          highOptionLabel: 'High',
          handleCallback: (density: string) =>
          setTableDensity({ tableDensity: density }),
        },
        inputSearch: {
          value: searchValue,
          placeholder: 'Search stuff...',
          onChange: (value: string) =>
            setSearchValue({ searchValue: value }),
          onClear: () => setSearchValue({ searchValue: null }),
          onSubmit: () => {},
        },
        download: {
          label: 'Export',
          handleCallback: () => alert('Callback()'),
        },
        // upload: {
        //   label: 'Import',
        //   handleCallback: () => alert('Callback()'),
        // },
        fields: {
          label: 'Toggle visible fields',
          showAllLabel: 'Show All',
          hideAllLabel: 'Hide All',
        },

        newLine: {
          label: 'Add Seller',
          handleCallback: () => setIsAddSellerOpen(true),
        },
      }}
      filters={{
        alwaysVisibleFilters: ['name', 'email'],
        statements: filterStatements,
        onChangeStatements: (newStatements: string) =>
          setFilterStatements({ filterStatements: newStatements }),
        clearAllFiltersButtonLabel: 'Clear Filters',
        collapseLeft: true,
        options: {
          name: {
            label: 'Name',
            ...simpleInputVerbsAndLabel(),
          },
          email: {
            label: 'Email',
            ...simpleInputVerbsAndLabel(),
          },
          streetAddress: {
            label: 'Street Address',
            ...simpleInputVerbsAndLabel(),
          },
          cityStateZipAddress: {
            label: 'City State Zip',
            ...simpleInputVerbsAndLabel(),
          },
        },
      }}

      bulkActions={{
        texts: {
          secondaryActionsLabel: 'Actions',
          rowsSelected: (qty: any) => (
            <Fragment>Selected rows: {qty}</Fragment>
          ),
          selectAll: 'Select all',
          allRowsSelected: (qty: any) => (
            <Fragment>All rows selected: {qty}</Fragment>
          ),
        },
        totalItems: 100,
        main: {
          label: 'Send email',
          handleCallback: (_params: any) => alert('TODO: SHOW EMAIL FORM'),
        },
        others: [
          {
            label: 'Delete',
            handleCallback: (params: any) => console.warn(params),
          },
        ],
      }}
    />
    <AddSeller isOpen={isAddSellerOpen} onClose = {closeModalAddSeller}/>
  </div>
  )
}

export default withRuntimeContext(Tables)

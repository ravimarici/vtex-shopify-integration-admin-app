import React, { SyntheticEvent, useState } from 'react'
import { useMutation } from 'react-apollo'
import { Modal, Button, Input } from 'vtex.styleguide'
import createSellerOnMarketPlace from '../graphql/createSellerOnMarketPlace.graphql'
interface Props {
  isOpen: boolean,
  onClose: Function,
}



const AddSeller = ({ isOpen, onClose }: Props) => {
  const [addSeller, { loading: loadingAdd }] = useMutation(createSellerOnMarketPlace)
  const [storeName, setStoreName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiPassword, setApiPassword] = useState('')


  const handleSubmit = (e: any) => {
    e.preventDefault()
    addSeller({
      variables: {
        shopifyStoreName: e.target[0].value,
        apiKey: e.target[1].value,
        apiPassword: e.target[2].value
      },
    }).then((e:any)=>{
      alert(
        'Successfully Added'
      )
    }).catch((e)=>{
      console.log(e)
    })


  }


  return (
    <Modal
      title={"Add Seller"}
      isOpen={isOpen}
      onClose={() => onClose()}>
      <form onSubmit={(e: SyntheticEvent) => handleSubmit(e)}>
        <div className="mt3 flex">
          <Input
            type="text"
            label={"Add Store Name"}
            value={storeName}
            onChange={(e: any) => {
              setStoreName(e.target.value)
            }}
          >
          </Input>
        </div>
        <div className="mt3 flex">
          <Input
            type="text"
            label={"Add Api Key"}
            value={apiKey}
            onChange={(e: any) => {
              setApiKey(e.target.value)
            }}
          >
          </Input>
        </div>
        <div className="mt3 flex">
          <Input
            type="text"
            label={"Add Api Password"}
            value={apiPassword}
            onChange={(e: any) => {
              setApiPassword(e.target.value)
            }}
          >
          </Input>
        </div>
        <div className="mt3 flex">
          <Button
            variation="primary"
            type="submit"
            isLoading={loadingAdd}
          >
            Add Seller
          </Button>
        </div>
      </form>

    </Modal>
  )
}

export default AddSeller

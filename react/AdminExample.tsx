import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'



import './styles.global.css'
import Tables from './UsersTable/Tables'

const AdminExample: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-example.hello-world" />}
        />
      }
    >
      <PageBlock variation="full">
        <Tables />
      </PageBlock>
    </Layout>
  )
}

export default AdminExample

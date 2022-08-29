import React, { FC } from 'react'
import { Layout, PageBlock } from 'vtex.styleguide'

const AdminExample: FC = () => {
  return (
    <Layout>
      <PageBlock title="Training App" subtitle="this is a example" variation="full">
        <h1>Hello, World!</h1>
      </PageBlock>
    </Layout>
  )
}

export default AdminExample
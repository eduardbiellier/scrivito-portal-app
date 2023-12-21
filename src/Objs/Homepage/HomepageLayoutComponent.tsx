import * as Scrivito from 'scrivito'
import { provideLayoutComponent, ContentTag, CurrentPage } from 'scrivito'
import { Homepage } from './HomepageObjClass'

// Workaround for SDK multisite bug
provideLayoutComponent(Homepage, ({ /*page*/ }) => {
  const page = Scrivito.Obj.root()

  return (
    <>
      <a href="#main" className="btn skip-to-content">
        Skip to Content
      </a>
      <ContentTag tag="header" content={page} attribute="siteHeader" />
      <main id="main">
        <CurrentPage />
      </main>
      <ContentTag
        tag="footer"
        content={page}
        attribute="siteFooter"
        className="bg-light-grey py-5"
      />
    </>
  )
})

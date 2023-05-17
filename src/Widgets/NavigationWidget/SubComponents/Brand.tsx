import * as Scrivito from 'scrivito'

export const Brand = Scrivito.connect(function Brand({
  root,
}: {
  root: Scrivito.Obj
}) {
  return (
    <Scrivito.InPlaceEditingOff>
      <Scrivito.LinkTag to={root} className="navbar-brand">
        <Scrivito.ImageTag
          content={root}
          attribute="siteLogoDark"
          className="navbar-brand-logo"
        />
      </Scrivito.LinkTag>
    </Scrivito.InPlaceEditingOff>
  )
})

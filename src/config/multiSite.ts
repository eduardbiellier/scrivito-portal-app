import * as Scrivito from 'scrivito'
import { Homepage } from '../Objs/Homepage/HomepageObjClass'

const NATIVE_SITE_ID = '6f5a41ce2735d33e'
const origin = import.meta.env.SCRIVITO_ORIGIN || window.location.origin
type HomepageInstance = InstanceType<typeof Homepage>

export function baseUrlForSite(siteId: string) {
  const siteRoot = Scrivito.Obj.onSite(siteId).root() as HomepageInstance | null
  if (!siteRoot) return
  const links = siteRoot.get('baseUrl')
  const primaryBaseUrlForSite = links[0]?.url()

  return primaryBaseUrlForSite || undefined
}

export function siteForUrl(url: string) {
  const exactMatchSiteId = bestSiteIdForUrl(
    url,
    Scrivito.Obj.onAllSites()
      .where('_path', 'equals', '/')
      .toArray() as HomepageInstance[],
  )

  const nativeSite = Scrivito.Obj.onSite(NATIVE_SITE_ID).root()
  const versionOfNativeSiteId =
    url.startsWith(origin) &&
    bestSiteIdForUrl(
      url,
      (nativeSite?.versionsOnAllSites() || []) as HomepageInstance[],
      pathOf,
    )

  const siteId = exactMatchSiteId || versionOfNativeSiteId

  if (siteId) {
    return {
      siteId,
      baseUrl: `${originOf(url)}/${pathOf(baseUrlForSite(siteId))}`,
    }
  }
}

function bestSiteIdForUrl(
  url: string,
  sites: HomepageInstance[],
  transformUrl = (s: string) => s,
) {
  return sites
    .sort(
      (a, b) =>
        (b.get('baseUrl')[0]?.url()?.length || 0) -
        (a.get('baseUrl')[0]?.url()?.length || 0),
    )
    .find((root) =>
      root.get('baseUrl').find((link) => {
        const linkUrl = link.url()
        if (linkUrl === null) return false
        return startsWith(transformUrl(url), transformUrl(linkUrl))
      }),
    )
    ?.siteId()
}

function pathOf(url?: string) {
  if (!url) return ''
  return url.replace(/.*?\b(\/|$)/, '')
}

function originOf(url: string) {
  return url.replace(/\b\/.*/, '')
}

function startsWith(url: string, prefix: string) {
  return (
    prefix === '' ||
    !!url.match(new RegExp(`^${prefix.replace(/\W/g, '\\$&')}(\\?|/|$)`))
  )
}

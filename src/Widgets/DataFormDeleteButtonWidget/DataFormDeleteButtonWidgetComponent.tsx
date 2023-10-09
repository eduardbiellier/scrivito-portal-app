import {
  ContentTag,
  currentPage,
  navigateTo,
  provideComponent,
  useDataItem,
} from 'scrivito'
import { DataFormDeleteButtonWidget } from './DataFormDeleteButtonWidgetClass'
import { useState } from 'react'
import { toast } from 'react-toastify'

provideComponent(DataFormDeleteButtonWidget, ({ widget }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const dataItem = useDataItem()
  const deletedMessage = widget.get('deletedMessage')
  const redirectToAfterDelete =
    widget.get('redirectToAfterDelete') || currentPage()?.parent()
  const buttonStyle =
    widget.get('buttonStyle') === 'btn-outline-primary'
      ? 'btn-outline-primary'
      : 'btn-danger'

  if (!dataItem) return null

  if (showConfirmation) {
    return (
      <div>
        <ContentTag
          content={widget}
          attribute="cancelTitle"
          tag="button"
          className="btn btn-sm"
          onClick={onDeleteRejected}
        />

        <ContentTag
          content={widget}
          attribute="confirmTitle"
          tag="button"
          className={`btn btn-sm ${buttonStyle}`}
          onClick={onDeleteConfirmed}
        />
      </div>
    )
  }

  return (
    <ContentTag
      content={widget}
      attribute="title"
      tag="button"
      className={`btn btn-sm ${buttonStyle}`}
      onClick={widget.get('requireConfirmation') ? onDelete : onDeleteConfirmed}
    />
  )

  function onDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setShowConfirmation(true)
  }

  function onDeleteRejected(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    setShowConfirmation(false)
  }

  async function onDeleteConfirmed(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    await dataItem?.destroy()

    if (deletedMessage) toast.success(deletedMessage)

    if (redirectToAfterDelete) navigateTo(redirectToAfterDelete)
  }
})

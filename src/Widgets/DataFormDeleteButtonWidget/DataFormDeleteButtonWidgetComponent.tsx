import {
  ContentTag,
  InPlaceEditingOff,
  isInPlaceEditingActive,
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
  const redirectAfterDelete = widget.get('redirectAfterDelete')
  const buttonStyle =
    widget.get('buttonStyle') === 'btn-outline-primary'
      ? 'btn-outline-primary'
      : 'btn-danger'

  if (!dataItem) return null

  if (showConfirmation) {
    return (
      <div>
        <InPlaceEditingOff>
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
        </InPlaceEditingOff>
      </div>
    )
  }

  return (
    <>
      {isInPlaceEditingActive() && (
        <div className="alert alert-warning d-flex m-auto">
          <i className="bi bi-exclamation-circle bi-2x" aria-hidden="true"></i>
          <div className="my-auto mx-2">
            <b>Editor note:</b> Deletes {dataItem.dataClass().name()}.
          </div>
        </div>
      )}
      <InPlaceEditingOff>
        <ContentTag
          content={widget}
          attribute="title"
          tag="button"
          className={`btn btn-sm ${buttonStyle}`}
          onClick={
            widget.get('requireConfirmation') ? onDelete : onDeleteConfirmed
          }
        />
      </InPlaceEditingOff>
    </>
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

    await dataItem?.delete()

    if (deletedMessage) toast.success(deletedMessage)

    if (redirectAfterDelete) navigateTo(redirectAfterDelete)
  }
})

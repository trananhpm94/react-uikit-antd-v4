import { useDispatch, useSelector } from 'react-redux';

export default (modalId) => {
  let modalData = useSelector((state) => state.compModalHook[modalId]);
  const dispatchModalHook = useDispatch().compModalHook;

  const showModal = (data) => {
    dispatchModalHook.showModal(modalId, data);
  };

  const hiddenModal = (data) => {
    dispatchModalHook.hiddenModal(modalId, data);
  };
  if (!modalData) {
    modalData = {
      visible: false,
      data: {}
    }
  }
  return [modalData, showModal, hiddenModal];
};

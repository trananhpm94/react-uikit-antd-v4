import React from 'react';
import { Modal } from 'antd';
import useModal from './useModal';

export default ({ id, title = '', ...props }) => {
  const [modalData = {}, , hiddenModal] = useModal(id);
  const onOk = async () => {
    if (props.onOk) {
      const result = await props.onOk();
      if (result !== false) {
        hiddenModal();
      }
    } else {
      hiddenModal();
    }
  };
  return (
    <Modal
      title={title}
      cancelText="Hủy"
      visible={modalData.visible}
      onCancel={() => hiddenModal()}
      style={{ top: 20 }}
      {...props}
      onOk={onOk}
    >
      {props.children}
    </Modal>
  );
};


export { useModal };
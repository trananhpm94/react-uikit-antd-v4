/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from 'react';
import './styles.scss';

export const EditableContext = React.createContext();

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentWillMount() {
    this.refFormItem = { props: null };
  }

  showEdit = () => {
    this.setState({ editing: true }, () => {
      if (this.refFormItem && typeof this.refFormItem.focus === 'function') {
        this.refFormItem.focus();
      }
    });
  };

  hiddenEdit = () => {
    this.setState({ editing: false });
  };

  renderCell = ({ form, onSaveCell }) => {
    const {
      editable,
      alwayShowEdit,
      dataIndex,
      rowKey,
      record,
      children,
      renderFormItemEdit,
      ...restProps
    } = this.props;
    const { editing } = this.state;
    const keyValue = record ? record[rowKey] : '';
    const onSave = onSaveCell(keyValue, this.hiddenEdit);
    const canEditing = alwayShowEdit || editing;
    // eslint-disable-next-line no-return-assign
    const setRefFormItem = node => (this.refFormItem = node);
    return (
      <td {...restProps}>
        {canEditing && renderFormItemEdit ? (
          <Fragment>{renderFormItemEdit({ form, record, setRefFormItem, onSave })}</Fragment>
        ) : // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        editable ? (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
              textDecorationLine: 'underline',
              textDecorationStyle: 'dashed',
              textDecorationColor: '#2196F3',
            }}
            onClick={this.showEdit}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

export default EditableCell;

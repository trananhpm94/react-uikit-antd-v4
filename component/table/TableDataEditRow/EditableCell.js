import React, { Fragment } from 'react';

export const EditableContext = React.createContext();

class EditableCell extends React.Component {
  renderCell = form => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      renderFormItemEdit,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing && renderFormItemEdit ? (
          <Fragment>{renderFormItemEdit({ form, record })}</Fragment>
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

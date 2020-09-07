export const actionGetData = async ({
  props,
  page,
  pageSize,
  loading,
  setLoading,
  setData,
  setPagination,
  setEditingKey,
}) => {
  const {
    allowGetData,
    paramSearch,
    service,
    handleGetDataResponse,
    getPageIndexForSevice,
    rowKey,
  } = props;
  if (!service || loading || !allowGetData) return;
  setLoading(true);
  try {
    const res = await service({
      page: getPageIndexForSevice(page) || 0,
      size: pageSize,
      ...paramSearch,
    });
    const { content, total } = handleGetDataResponse(res);
    const pagination = { total, current: page };
    setData(content);
    setPagination(pagination);
    setEditingKeyFromContent({ content, rowKey, setEditingKey });
  } finally {
    setLoading(false);
  }
};

const setEditingKeyFromContent = ({ content, rowKey, setEditingKey }) => {
  if (!setEditingKey) return;
  const itemEditing = content.find((item) => item.editing);
  if (!itemEditing) return;
  const editingKey = itemEditing[rowKey];
  setEditingKey(editingKey);
};

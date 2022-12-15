import { AutoComplete, Input } from 'antd';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import { searchFood } from '../../api/food-entry-api';

function FoodNameInput({ value, onChange }) {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      if (!search) {
        return;
      }
      setLoadingSuggestions(true);
      try {
        const searchResp = await searchFood(search);
        setSuggestions(searchResp.data.map((val) => ({ label: val.name, value: val.name })));
        setLoadingSuggestions(false);
      } catch (err) {
        setSuggestions([]);
        setLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  return (
    <AutoComplete
      value={value}
      options={suggestions}
      onSearch={debouncedSearch}
      onChange={onChange}
      placeholder={'Food name'}
    >
      <Input.Search allowClear loading={loadingSuggestions} />
    </AutoComplete>
  );
}

FoodNameInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default FoodNameInput;

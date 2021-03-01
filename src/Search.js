import { useState } from 'react';
import { TextField, FormControl, Button, Input } from '@material-ui/core';

const isNumeric = value => /^-?\d+$/.test(value);

const Search = ({ onSearch, disabled }) => {
  const [isError, setIsError] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()

    const term = e.target[0].value
    const min = e.target[1].value
    const max = e.target[2].value

    if ((min && !isNumeric(min)) || (max && !(isNumeric(max)))) {
      setIsError(true)
      return
    } else {
      setIsError(false)
      onSearch({ term, minYear: +min, maxYear: +max });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <TextField
          name="disease"
          placeholder="Enter a disease..."
        />
        <TextField
          name="minYear"
          placeholder="Minimum year"
        />
        <TextField
          name="maxYear"
          placeholder="Maximum year"
        />
        <Button type="submit" disabled={disabled}>Search</Button>
        {isError ? <h4>Invalid date entry</h4> : null}
      </FormControl>
    </form>
  );
}

export default Search;
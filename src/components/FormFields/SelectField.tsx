import { Control, useController } from "react-hook-form";

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core";

export interface SelectOption {
  label?: string;
  value: number | string;
}

export interface SelectFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  disabled?: boolean;
  options: SelectOption[];
}

export function SelectField({ name, control, label, disabled, options }: SelectFieldProps) {
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });

  return (
    <FormControl
      variant="outlined"
      size="small"
      fullWidth
      disabled={disabled}
      margin="normal"
      error={invalid}
    >
      <InputLabel id={`${name}_label`}>City</InputLabel>
      <Select
        labelId={`${name}_label`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>{error?.message}</FormHelperText>
    </FormControl>
  );
}

# Vue2 Clock Picker

A simple clock picker component for `vue v2.x`.


![Screenshot](./screenshot.png)

### Installation

```
$ npm install @pencilpix/vue2-clock-picker --save
```
or

```
$ yarn add @pencilpix/vue2-clock-picker
```

  - __In Browser:__

    ```html
    <script src="node_modules/vuejs/dist/vue.min.js"></script>
    <script src="path/to/vue2-clock-picker/dist/vue2-clock-picker.min.js">

    <script>
      Vue.use(VueClockPicker);
    </script>
    ```

  - __Module:__
      ```js
      import VueClockPicker from 'vue2-clock-picker';
      ```


### Usage

once component is installed it can be used as:

```html
<vue-clock-picker></vue-clock-picker>
```


#### props

prop           | type         | default
---------------|--------------|-------------
placeholder    | `String`     | input placeholder default `''`
name           | `String`     | input name default `''`
label          | `String`     | label text will be hidden if not set. default `''`
input-class    | `String`     | css custom class to be applied to input. default `''`.
input-container-class | `String`| css custom class to be applied to input container.
input-value-class | `String`| css custom class to be applied to input container when input contains value. default `''`.
input-focus-class | `String` | css custom class to be applied to input container when the input is focused. default `''`.
input-error-class | `String` | css custom class to be applied to input container when the value not match `HH:MM` or the input is required and the value is empty.
value                 | `String` | initial value of input. default `''`
required              | `Boolean` | set it to true if time field is required. default `false`



#### events

event           | when
----------------|--------------
beforeOpen      | just before opening the dialog.
open            | just after opening the dialog.
beforeClose     | just before closing the dialog.
close           | just after closing the dialog.
timeset         | after the value of input is set. and it will recieve the value as `01:02`
cancel          | when cancel dialog button is clicked and it will receive the value found at cancel time.




#### methods

method     | behavior
-----------|-----------
open       | open the dialog
close      | close the dialog
getValue   | return the current value of the input as `02:00`
setValue   | set the current value of input and it accept `String` with valid time `HH:MM`


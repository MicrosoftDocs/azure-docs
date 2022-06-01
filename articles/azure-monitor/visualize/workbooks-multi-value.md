# Multi-value Parameters

A multi-value parameter allows the user to set one or more arbitrary text values. Multi-value parameters are commonly used for filtering, oftentimes when a drop down control may contain too many values to be useful.


## Creating a static multi-value parameter
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Click on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `Filter`
    2. Parameter type: `Multi-value`
    3. Required: `unchecked`
    4. Get data from: `None`
5. Choose 'Save' from the toolbar to create the parameter.
6. The Filter parameter will be a multivalue parameter, initially with no values:

   ![Image showing the creation of mulit-value param](../Images/Parameters-MultiValue-Create.png)

7. the user can then add multiple values:

   ![Image showing the user adding a 3rd value](../Images/Parameters-MultiValue-ThirdValue.png)


A multi-value parameter behaves similarly to a multi-select [Drop Down](./DropDown.md) parameter. As such, it is commonly used in an "in" like scenario

```
    let computerFilter = dynamic([{Computer}]);
    Heartbeat
    | where array_length(computerFilter) == 0 or Computer in (computerFilter)
    | summarize Heartbeats = count() by Computer
    | order by Heartbeats desc
```

## Parameter field style
Multi-value parameter supports following field style:
1. Standard: Allows a user to add or remove arbitrary text items

![Image showing standard multi-value field](../Images/StandardMultiValue.png)

2. Password: Allows a user to add or remove arbitrary password fields. The password values are only hidden on UI when user types. The values are still fully accessible as a param value when referred and they are stored unencrypted when workbook is saved.

![Image showing password multi-value field](../Images/PasswordMultivalue.png)

## Creating a multi-value with initial values.
You can use a query to seed the multi-value parameter with initial values. The user can then manually remove values, or add additional values. If a query is used to populate the multi-value parameter, a restore defaults button will appear on the parameter to restore back to the originally queried values.

1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Click on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `Filter`
    2. Parameter type: `Multi-value`
    3. Required: `unchecked`
    5. Get data from: `JSON`
5. In the JSON Input text block, insert this json snippet:
    ```
    ["apple", "banana", "carrot" ]
    ```
    All of the items that are the result of the query will be shown as multi value items.
    (you are not limited to JSON, you can use any query provider to provide initial values, but will be limited to the first 100 results)
6. Use the blue `Run Query` button.
7. Choose 'Save' from the toolbar to create the parameter.
8. The Filter parameter will be a multi-value parameter with 3 initial values

   ![Image showing the creation of a dynamic drop down](../Images/Parameters-MultiValue-InitialValues.png)

See also:

[Parameter Options](formatting.md)

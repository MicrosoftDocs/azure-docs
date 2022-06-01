# Text Parameter Criteria

When a query depends on many parameters, then the query will be stalled until each of it's parameters have been resolved. Sometimes a parameter could have a simple query that concatenates a string or performs a conditional evaluation. However these queries still make network calls to services that perform these basic operations and that increases the time it takes for a parameter to resolve a value. This results in long load times for complex workbooks.

Criteria Text parameters solve this issue, as an author can define a set of criteria based on previously specified parameters, which will be evaluated to provide a dynamic value. The main benefit of using Criteria parameters is that it has the ability to resolve values of previously specified parameters and perform simple conditional operations without making any network calls. Below is an example of such a use case.

## Example
Consider the conditional query below:

![Image showing the conditional query](../Images/Parameters-Criteria-Conditional-Query.png)

```
let metric = dynamic({Counter});
print tostring((metric.object == 'Network Adapter' and (metric.counter == 'Bytes Received/sec' or metric.counter == 'Bytes Sent/sec')) or (metric.object == 'Network' and (metric.counter == 'Total Bytes Received' or metric.counter == 'Total Bytes Transmitted')))
```

If the user is mainly focused on the `metric.counter` object, essentially the value of the parameter `isNetworkCounter` should be true, if the parameter `Counter` has `Bytes Received/sec`, `Bytes Sent/sec`, `Total Bytes Received`, or `Total Bytes Transmitted`.

This can be translated to a criteria text parameter like so:

![Image showing the criteria example](../Images/Parameters-Criteria-Example.png)

In the image above, the conditions will be evaluated from top to bottom and the value of the parameter `isNetworkCounter` will take the value of which ever condition evaluates to true first. All conditions except for the default condition (the 'else' condition) can be reordered to get the desired outcome.

## Setting up Criteria
1. Start with a workbook with at least one existing parameter in edit mode.
    1. Choose Add parameters from the links within the workbook.
    2. Click on the blue Add Parameter button.
    3. In the new parameter pane that pops up enter:
        1. Parameter name: rand
        2. Parameter type: Text
        3. Required: checked
        4. Get data from: Query
        5. Enter `print rand(0-1)` into the query editor. This parameter will output a value between 0-1.
    4. Choose 'Save' from the toolbar to create the parameter. 

    >Note: The first parameter in the workbook will not show the `Criteria` tab

![Image showing the first parameter](../Images/Parameters-Criteria-First-Param.png)

2. In the table with the 'rand' parameter, click on the blue Add Parameter button.
3. In the new parameter pane that pops up enter:
    1. Parameter name: randCriteria
    2. Parameter type: Text
    3. Required: checked
    4. Get data from: Criteria
4. A grid should appear, click on 'Edit' next to the blank text box, this will bring up a 'Criteria Settings' form. Refer to [Criteria Settings form](#criteria-settings-form) for the description of each field.

![Image showing the criteria settings form](../Images/Parameters-Criteria-Setting.png)

5. Enter the data below to populate the first Criteria, then click 'OK'.
    1. First operand: rand
    2. Operator: >
    3. Value from: Static Value
    4. Second Operand: 0.25
    5. Value from: Static Value
    6. Result is: is over 0.25

![Image showing the criteria settings form filled](../Images/Parameters-Criteria-Setting-Filled.png)

6. Click on edit, next to the condition `Click edit to specify a result for the default condition.`, this will edit the default condition.

    >Note: For the default condition, everthing should be disabled except for the last `Value from` and `Result is` fields.

7. Enter the data below to populate the default condition, then click 'OK'.
    1. Value from: Static Value
    2. Result is: is 0.25 or under

![Image showing the criteria settings default form filled](../Images/Parameters-Criteria-Default.png)

8. Save the Parameter
9. Click on the refresh button on the workbook, to see the `randCriteria` parameter in action. It's value will be based on the the value of `rand`!

## Criteria Settings form.
|Form fields|Description|
|-----------|----------|
|First operand| This is a dropdown consisting of parameter names that have already been created. The value of the parameter will be used on the left hand side of the comparison |
|Operator|The operator used to compare the first and the second operands. Can be a numerical or string evaluation. The operator `is empty` will disable the `Second operand` as only the `First operand` is required.|
|Value from|If set to `Parameter`, a dropdown consisting of parameters that have already been created will be shown. The value of that parameter will be used on the right hand side of the comparison.<br/> If set to `Static Value`, a text box will be shown where an author can enter a value for the right hand side of the comparison.|
|Second Operand| Will be either a dropdown menu consisting of created parameters, or a textbox depending on the above `Value from` selection.|
|Value from|If set to `Parameter`, a dropdown consisting of parameters that have already been created will be shown. The value of that parameter will be used for the return value of the current parameter.<br/> If set to `Static Value`:<ul><li> a text box will be shown where an author can enter a value for the result.</li> <li>An author can also dereference other parameters by using curly braces around the parameter name.</li><li>It is possible concatenate multiple parameters and create a custom string, for example: "`{paramA}`, `{paramB}`, and some string" </li></ul>If set to `Expression`<ul><li> a text box will be shown where an author can enter a mathematical expression that will be evaluated as the result</li><li>Like the `Static Value` case, multiple parameters may be dereferenced in this text box.</li><li>If the parameter value referenced in the text box is not a number, it will be treated as the value `0`</li></ul> |
|Result is| Will be either a dropdown menu consisting of created parameters, or a textbox depending on the above Value from selection. The textbox will be evaluated as the final result of this Criteria Settings form.
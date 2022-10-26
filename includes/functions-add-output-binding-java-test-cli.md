---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---
## Update the tests

Because the archetype also creates a set of tests, you need to update these tests to handle the new `msg` parameter in the `run` method signature.  

Browse to the location of your test code under _src/test/java_, open the *Function.java* project file, and replace the line of code under `//Invoke` with the following code:

:::code language="java" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/src/test/java/com/function/FunctionTest.java" range="48-50":::

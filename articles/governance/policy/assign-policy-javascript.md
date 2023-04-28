---
title: "Quickstart: New policy assignment with JavaScript"
description: In this quickstart, you use JavaScript to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 08/17/2021
ms.topic: quickstart
ms.custom: devx-track-js
---
# Quickstart: Create a policy assignment to identify non-compliant resources using JavaScript

The first step in understanding compliance in Azure is to identify the status of your resources. In
this quickstart, you create a policy assignment to identify virtual machines that aren't using
managed disks. When complete, you'll identify virtual machines that are _non-compliant_.

The JavaScript library is used to manage Azure resources from the command line or in scripts. This
guide explains how to use JavaScript library to create a policy assignment.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a
  [free](https://azure.microsoft.com/free/) account before you begin.

- **Node.js**: [Node.js](https://nodejs.org/) version 12 or higher is required.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Add the Policy libraries

To enable JavaScript to work with Azure Policy, the libraries must be added. These libraries work
wherever JavaScript can be used, including [bash on Windows 10](/windows/wsl/install-win10).

1. Set up a new Node.js project by running the following command.

   ```bash
   npm init -y
   ```

1. Add a reference to the yargs library.

   ```bash
   npm install yargs
   ```

1. Add a reference to the Azure Policy libraries.

   ```bash
   # arm-policy is for working with Azure Policy objects such as definitions and assignments
   npm install @azure/arm-policy

   # arm-policyinsights is for working with Azure Policy compliance data such as events and states
   npm install @azure/arm-policyinsights
   ```

1. Add a reference to the Azure authentication library.

   ```bash
   npm install @azure/identity
   ```

   > [!NOTE]
   > Verify in _package.json_ `@azure/arm-policy` is version **5.0.1** or higher,
   > `@azure/arm-policyinsights` is version **5.0.0** or higher, and `@azure/identity` is
   > version **2.0.4** or higher.

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** (`06a78e20-9358-41c9-923c-fb736d382a4d`) definition. This policy definition
identifies resources that aren't compliant to the conditions set in the policy definition.

1. Create a new file named _policyAssignment.js_ and enter the following code.

   ```javascript
   const argv = require("yargs").argv;
   const { DefaultAzureCredential } = require("@azure/identity");
   const { PolicyClient } = require("@azure/arm-policy");

   if (argv.subID && argv.name && argv.displayName && argv.policyDefID && argv.scope && argv.description) {

       const createAssignment = async () => {
           const credentials = new DefaultAzureCredential();
           const client = new PolicyClient(credentials, argv.subID);

           const result = await client.policyAssignments.create(
               argv.scope,
               argv.name,
               {
                   displayName: argv.displayName,
                   policyDefinitionId: argv.policyDefID,
                   description: argv.description
               }
           );
           console.log(result);
       };

       createAssignment();
   }
   ```

1. Enter the following command in the terminal:

   ```bash
   node policyAssignment.js `
      --subID "{subscriptionId}" `
      --name "audit-vm-manageddisks" `
      --displayName "Audit VMs without managed disks Assignment" `
      --policyDefID "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d" `
      --description "Shows all virtual machines not using managed disks" `
      --scope "{scope}"
   ```

The preceding commands use the following information:

- **subID** - The subscription ID for authentication context. Be sure to replace `{subscriptionId}`
  with your subscription.
- **name** - The unique name for the policy assignment object. The example above uses
  _audit-vm-manageddisks_.
- **displayName** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **policyDefID** - The policy definition path, based on which you're using to create the
  assignment. In this case, it's the ID of policy definition _Audit VMs that do not use managed
  disks_.
- **description** - A deeper explanation of what the policy does or why it's assigned to this scope.
- **scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a management group to an individual resource. Be sure to replace
  `{scope}` with one of the following patterns:
  - Management group: `/providers/Microsoft.Management/managementGroups/{managementGroup}`
  - Subscription: `/subscriptions/{subscriptionId}`
  - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
  - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]`

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Now that your policy assignment is created, you can identify resources that aren't compliant.

1. Create a new file named _policyState.js_ and enter the following code.

   ```javascript
   const argv = require("yargs").argv;
   const { DefaultAzureCredential } = require("@azure/identity");
   const { PolicyInsightsClient } = require("@azure/arm-policyinsights");

   if (argv.subID && argv.name) {

       const getStates = async () => {

           const credentials = new DefaultAzureCredential();
           const client = new PolicyInsightsClient(credentials);
           const result = client.policyStates.listQueryResultsForSubscription(
               "latest",
               argv.subID,
               {
                   queryOptions: {
                       filter: "IsCompliant eq false and PolicyAssignmentId eq '" + argv.name + "'",
                       apply: "groupby((ResourceId))"
                   }
               }
           );
           console.log(result);
       };

       getStates();
   }
   ```

1. Enter the following command in the terminal:

   ```bash
   node policyState.js --subID "{subscriptionId}" --name "audit-vm-manageddisks"
   ```

Replace `{subscriptionId}` with the subscription you want to see the compliance results for the
policy assignment named 'audit-vm-manageddisks' that we created in the previous steps. For a list of
other scopes and ways to summarize the data, see
[PolicyStates*](/javascript/api/@azure/arm-policyinsights/) methods.

Your results resemble the following example:

```output
{
    'additional_properties': {
        '@odata.nextLink': None
    },
    'odatacontext': 'https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest',
    'odatacount': 12,
    'value': [{data}]
}
```

The results match what you see in the **Resource compliance** tab of a policy assignment in the
Azure portal view.

## Clean up resources

- Delete the policy assignment _Audit VMs without managed disks Assignment_ through the portal. The
  policy definition is a built-in, so there's no definition to remove.

- If you wish to remove the installed libraries from your application, run the following command.

  ```bash
  npm uninstall @azure/arm-policy @azure/arm-policyinsights @azure/identity yargs
  ```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policy definitions to validate that new resources are compliant,
continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)

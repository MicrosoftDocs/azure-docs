---
description: How to acquire a token for the authenticated user in Azure Cloud Shell
ms.contributor: jahelmic
ms.date: 10/06/2023
ms.topic: article
tags: azure-resource-manager
ms.custom: devx-track-linux
title: Acquiring a user token in Azure Cloud Shell
---
# Acquire a token in Azure Cloud Shell
<!--
TODO:
- MSI is never mentioned in this article - what is it?
- Need powershell example - there are examples in other articles - be consistent
-->
Azure Cloud Shell provides an endpoint that automatically authenticates the user logged into the
Azure portal. Use this endpoint to acquire access tokens to interact with Azure services.

## Authenticating in the Cloud Shell

The Azure Cloud Shell has its own endpoint that interacts with your browser to automatically log you
in. When this endpoint receives a request, it sends the request back to your browser, which forwards
it to the parent Portal frame. The Portal window makes a request to Microsoft Entra ID, and the
resulting token is returned.

If you want to authenticate with different credentials, you can do so using `az login` or
`Connect-AzAccount`

## Acquire and use access token in Cloud Shell

### Acquire token

Execute the following commands to set your user access token as an environment variable,
`ACCESS_TOKEN`.

```bash
RESPONSE=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
ACCESS_TOKEN=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The access token is $ACCESS_TOKEN
```

### Use token

Execute the following command to get a list of all Virtual Machines in your account, using the token
you acquired in the previous step.

```bash
curl https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2021-07-01 -H "Authorization: Bearer $ACCESS_TOKEN" -H "x-ms-version: 2019-02-02"
```

## Handling token expiration

The local authentication endpoint caches tokens. You can call it as often as you like. Cloud Shell
only calls Microsoft Entra ID when there's no token stored in the cache or the token has expired.

## Limitations

- There's an allowlist of resources that Cloud Shell tokens can be provided for. When you try to use
  a token with a service that is not listed, you may see the following error message:

  ```output
  "error":{"code":"AudienceNotSupported","message":"Audience https://newservice.azure.com/
  isn't a supported MSI token audience...."}
  ```

  You can open an issue on [GitHub][02] to request for the service to be added to the allowlist.

- If you sign in explicitly using the `az login` command, any Conditional Access rules your company
  may have in place are evaluated based on the Cloud Shell container rather than the machine where
  your browser runs. The Cloud Shell container doesn't count as a managed device for these policies
  so rights may be limited by the policy.

- Azure Managed Identities aren't available in the Azure Cloud Shell. Read more about
  [Azure Managed Identities][01].

<!-- link references -->
[01]: ../active-directory/managed-identities-azure-resources/overview.md
[02]: https://github.com/Azure/CloudShell/issues

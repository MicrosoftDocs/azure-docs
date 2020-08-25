---
author: baanders
description: include file for role requirement in Azure Digital Twins setup
ms.service: digital-twins
ms.topic: include
ms.date: 7/17/2020
ms.author: baanders
---

[!INCLUDE [cloud-shell-try-it.md](cloud-shell-try-it.md)]

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to be classified as an Owner in your Azure subscription. 

You can check your permission level by running this command in Cloud Shell:

```azurecli-interactive
az role assignment list --assignee <your-Azure-email>
```

If you are an owner, the `roleDefinitionName` value in the output is *Owner*:

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/cloud-shell/owner-role.png" alt-text="Cloud Shell window showing output of the az role assignment list command":::

If you find that the value is *Contributor* or something other than *Owner*, you can proceed in one of the following ways:
* Contact your subscription Owner and request for the Owner to complete the steps in this article on your behalf
* Contact either your subscription Owner or someone with User Access Admin role on the subscription, and request that they elevate you to Owner on the subscription so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.
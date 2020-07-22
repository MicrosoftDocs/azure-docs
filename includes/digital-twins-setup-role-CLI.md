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

:::image type="content" source="../articles/digital-twins/media/how-to-set-up-instance/owner-role.png" alt-text="Cloud Shell window showing output of the az role assignment list command":::

If you find that the value is *Contributor* or something other than *Owner*, you can contact your subscription Owner and proceed in one of the following ways:
* Request for the Owner to complete the steps in this article on your behalf
* Request for the Owner to elevate you to Owner on the subscription as well, so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.

---
ms.author: tarcher
ms.topic: include
ms.date: 04/22/2023
ms.custom: devx-track-terraform
---

Run [terraform init](https://www.terraform.io/docs/commands/init.html) to initialize the Terraform deployment. This command downloads the Azure provider required to manage your Azure resources.

```console
terraform init -upgrade
```

**Key points:**

- The `-upgrade` parameter upgrades the necessary provider plugins to the newest version that complies with the configuration's version constraints.

---
ms.author: tarcher
ms.topic: include
ms.date: 04/22/2023
ms.custom: devx-track-terraform
---

When you no longer need the resources created via Terraform, do the following steps:

1. Run [terraform plan](https://www.terraform.io/docs/commands/plan.html) and specify the `destroy` flag.

    ```console
    terraform plan -destroy -out main.destroy.tfplan
    ```

    [!INCLUDE [terraform-plan-notes.md](terraform-plan-notes.md)]

1. Run [terraform apply](https://www.terraform.io/docs/commands/apply.html) to apply the execution plan.

    ```console
    terraform apply main.destroy.tfplan
    ```

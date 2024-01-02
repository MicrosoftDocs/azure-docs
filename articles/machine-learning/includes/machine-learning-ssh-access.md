---
author: sdgilley
ms.service: machine-learning
ms.topic: include
ms.date: 08/05/2022
ms.author: sgilley
---

After you create a compute with SSH access enabled, use these steps for access.

1. Find the compute in your workspace resources:
    1. On the left, select **Compute**.
    1. Use the tabs at the top to select **Compute instance** or **Compute cluster** to find your machine.
1. Select the compute name in the list of resources.
1. Find the connection string:

    * For a **compute instance**, select **Connect** at the top of the **Details** section.

        :::image type="content" source="../media/how-to-create-attach-studio/details.png" alt-text="Screenshot that shows connect tool at the top of the Details page.":::

    * For a **compute cluster**, select **Nodes** at the top, then select the **Connection string** in the table for your node.
        :::image type="content" source="../media/how-to-create-attach-studio/compute-nodes.png" alt-text="Screenshot that shows connection string for a node in a compute cluster.":::

1. Copy the connection string.
1. For Windows, open PowerShell or a command prompt:
   1. Go into the directory or folder where your key is stored
   1. Add the -i flag to the connection string to locate the private key and point to where it is stored:
    
      `ssh -i <keyname.pem> azureuser@... (rest of connection string)`

1. For Linux users, follow the steps from [Create and use an SSH key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys)
1. For SCP use: 

   `scp -i key.pem -P {port} {fileToCopyFromLocal }  azureuser@yourComputeInstancePublicIP:~/{destination}`

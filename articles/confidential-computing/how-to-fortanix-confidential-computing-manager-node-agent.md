---
title: Run an app with Fortanix Confidential Computing Manager
description: Learn how to use Fortanix Confidential Computing Manager to convert your containerized images.
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: how-to
ms.date: 03/24/2021
ms.author: mamccrea
ms.custom: ignite-fall-2021
---
# Run an application by using Fortanix Confidential Computing Manager

Learn how to run your application in Azure confidential computing by using [Fortanix Confidential Computing Manager](https://azuremarketplace.microsoft.com/marketplace/apps/fortanix.em_managed?tab=Overview) and [Node Agent](https://azuremarketplace.microsoft.com/marketplace/apps/fortanix.rte_node_agent) from [Fortanix](https://www.fortanix.com/).


Fortanix is a third-party software vendor that provides products and services that work with the Azure infrastructure. There are other third-party providers that offer similar confidential computing services for Azure.

> [!Note]
> Some of the products referenced in this document aren't provided by Microsoft. Microsoft is providing this information only as a convenience. References to these non-Microsoft products doesn't imply endorsement by Microsoft.

This tutorial shows you how to convert your application image into a confidential compute-protected image. The environment uses [Fortanix](https://www.fortanix.com/) software, powered by Azure DCsv2-series Intel SGX-enabled virtual machines. The solution orchestrates critical security policies like identity verification and data access control.

For Fortanix support, join the [Fortanix Slack community](https://fortanix.com/community/). Use the `#enclavemanager` channel.

## Prerequisites

- If you don't have a Fortanix Confidential Computing Manager account, [sign up](https://ccm.fortanix.com/auth/sign-up) before you start.
- You need a private [Docker](https://docs.docker.com/) registry to push converted application images.
- If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you start.

> [!NOTE]
> Free trial accounts don't have access to the virtual machines used in this tutorial. To complete the tutorial, you need a pay-as-you-go subscription.

## Add an application to Fortanix Confidential Computing Manager

1. Sign in to [Fortanix Confidential Computing Manager (Fortanix CCM)](https://ccm.fortanix.com).
1. Go to the **Accounts** page and select **ADD ACCOUNT** to create a new account:

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/create-account-new.png" alt-text="Screenshot that shows how to create an account.":::

1. After your account is created, click **SELECT ACCOUNT** to select the newly created account. You can now start enrolling compute nodes and creating applications.
1. On the **Applications** tab, select **+ APPLICATION** to add an application. In this example, we'll add an Enclave OS application that runs a Python Flask server.

1. Select the **ADD** button for the **Enclave OS Application**:

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/add-enclave-application.png" alt-text="Screenshot that shows how to add an application.":::

   > [!NOTE]
   > This tutorial covers adding only Enclave OS applications. For information about adding EDP Rust Applications, see [Bringing EDP Rust Apps to Confidential Computing Manager](https://support.fortanix.com/hc/en-us/articles/360044746932-Bringing-EDP-Rust-Apps-to-Confidential-Computing-Manager).

1. In this tutorial, we'll use the Fortanix Docker registry for the sample application. Enter the specified values for the following settings. Use your private Docker registry to store the output image.

    - **Application name**: Python Application Server
    - **Description**: Python Flask Server
    - **Input image name**: fortanix/python-flask
    - **Output image name**: fortanix-private/python-flask-sgx (Replace with your own registry.)
    - **ISVPRODID**: 1
    - **ISVSVM**: 1
    - **Memory size**: 1 GB
    - **Thread count**: 128

      *Optional*: Run the non-converted application.
    - **Docker Hub**: [https://hub.docker.com/u/fortanix](https://hub.docker.com/u/fortanix)
    - **App**: fortanix/python-flask

      Run the following command:

      ```bash
         sudo docker run fortanix/python-flask
      ```
      > [!NOTE]
      > We don't recommend that you use your private Docker registry to store the output image.

1. Add a certificate. Enter the following values, and then select **NEXT**:
    - **Domain**: myapp.domain.com
    - **Type**: Certificate Issued by Confidential Computing Manager
    - **Key path**: /run/key.pem
    - **Key type**: RSA
    - **Certificate path**: /run/cert.pem
    - **RSA Key Size**: 2048 Bits

## Create an image

A Fortanix CCM Image is a software release or version of an application. Each image is associated with one enclave hash (MRENCLAVE).

1. On the **Add image** page, enter the registry credentials for **Output image name**. These credentials are used to access the private Docker registry where the image will be pushed. Because the input image is stored in a public registry, you don't need to provide credentials for the input image.
1. Enter the image tag and select **CREATE**:

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/create-image.png" alt-text="Screenshot that shows how to create an image.":::


## Domain and image allowlist

An application whose domain is added to the allowlist will get a TLS certificate from the Fortanix Confidential Computing Manager. When an Enclave OS application starts, it will contact the Fortanix Confidential Computing Manager to receive that TLS certificate.

On the **Tasks** tab on the left side of the screen, approve the pending requests to allow the domain and image.

## Enroll the compute node agent in Azure

### Create and copy a join token

You'll now create a token in Fortanix Confidential Computing Manager. This token allows a compute node in Azure to authenticate itself. Your Azure virtual machine will need this token.

1. On the **Compute Nodes** tab, select **ENROLL NODE**.
1. Select the **COPY** button to copy the join token. The compute node uses this join token to authenticate itself.

### Enroll nodes into Fortanix Node Agent

Creating a Fortanix node agent will deploy a virtual machine, network interface, virtual network, network security group, and public IP address in your Azure resource group. Your Azure subscription will be billed hourly for the virtual machine. Before you create a Fortanix node agent, review the Azure [virtual machine pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) for DCsv2-series. Delete any Azure resources that you're not using.

1. Go to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/) and sign in with your Azure credentials.
1. In the search box, enter **Fortanix Confidential Computing Node Agent**. In the search results, select **Fortanix Confidential Computing Node Agent** to go to the [app's home page](https://azuremarketplace.microsoft.com/marketplace/apps/fortanix.rte_node_agent?tab=OverviewFortanix):

    :::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/search-fortanix-marketplace.png" alt-text="Screenshot that shows how to get to the app's home page.":::
1. Select **Get It Now**, provide your information if necessary, and then select **Continue**. You'll be redirected to the Azure portal.
1. Select **Create** to go to the Fortanix Confidential Computing Node Agent deployment page.
1. On this page, you'll enter information to deploy a virtual machine. The VM is a DCsv2-series Intel SGX-enabled virtual machine from Azure that has Fortanix Node Agent software installed on it. The node agent will allow your converted image to run with increased security on Intel SGX nodes in Azure. Select the subscription and resource group where you want to deploy the virtual machine and associated resources.

   > [!NOTE]
   > Constraints apply when you deploy DCsv2-series virtual machines in Azure. You might need to request quota for additional cores. Read about [confidential computing solutions on Azure VMs](./virtual-machine-solutions-sgx.md) for more information.

1. Select an available region.
1. In the **Node Name** box, enter a name for your virtual machine.
1. Enter a user name and password (or SSH key) for authenticating into the virtual machine.
1. Leave the default **OS Disk Size** of **200**. Select a **VM Size**. (**Standard_DC4s_v2** will work for this tutorial.)
1. In the **Join Token** box, paste in the token that you created earlier in this tutorial:

   :::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/deploy-fortanix-node-agent-protocol.png" alt-text="Screenshot that shows how to deploy a resource.":::

1. Select **Review + create**. Make sure the validation passes, and then select **Create**. When all the resources deploy, the compute node is enrolled in Fortanix Confidential Computing Manager.

## Run the application image on the compute node

Run the application by running the following command. Be sure to change the node IP, port, and converted image name to the values for your application.

For this tutorial, here's the command to run:

```bash
    sudo docker run \
        --device /dev/isgx:/dev/isgx \
        --device /dev/gsgx:/dev/gsgx \
        -v /var/run/aesmd/aesm.socket:/var/run/aesmd/aesm.socket \
        -e NODE_AGENT_BASE_URL=http://52.152.206.164:9092/v1/ fortanix-private/python-flask-sgx
```

In this command:

- `52.152.206.164` is the node agent host IP.
- `9092` is the default port that Node Agent listens to.
- `fortanix-private/python-flask-sgx` is the converted app. You can find it in the Fortanix Confidential Computing Manager Web Portal. It's on the **Images** tab, in the **Image Name** column of the **Images** table.

## Verify and monitor the running application

1. Return to [Fortanix Confidential Computing Manager](https://ccm.fortanix.com/console).
1. Be sure you're working in the **Account** where you enrolled the node.
1. On the **Applications** tab, verify that there's a running application with an associated compute node.

## Clean up resources

If you no longer need them, you can delete the resource group, virtual machine, and associated resources. Deleting the resource group will unenroll the nodes associated with your converted image.

Select the resource group for the virtual machine, and then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

To delete the Fortanix Confidential Computing Manager account you created, go to the [Accounts page](https://ccm.fortanix.com/accounts) in the Fortanix Confidential Computing Manager. Hover over the account you want to delete. Select the vertical black dots in the upper-right corner and then select **DELETE ACCOUNT**.

:::image type="content" source="media/how-to-fortanix-confidential-computing-manager-node-agent/delete-account.png" alt-text="Screenshot that shows how to delete an account.":::

## Next steps

In this tutorial, you used Fortanix tools to convert your application image to run on top of a confidential computing virtual machine. For more information about confidential computing virtual machines on Azure, see [Solutions on virtual machines](virtual-machine-solutions-sgx.md).

To learn more about Azure confidential computing offerings, see [Azure confidential computing overview](overview.md).

You can also learn how to complete similar tasks by using other third-party offerings on Azure, like [Anjuna](https://azuremarketplace.microsoft.com/marketplace/apps/anjuna1646713490052.anjuna_cc_saas?tab=Overview) and [Scone](https://sconedocs.github.io).

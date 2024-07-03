---
title: Quickstart for Microsoft Azure Data Box Heavy| Microsoft Docs
description: In this quickstart, learn how to deploy Azure Data Box Heavy using the Azure portal, including how to cable, configure, and copy data to upload to Azure.
services: databox
author: stevenmatthew
ms.service: databox
ms.subservice: heavy
ms.topic: quickstart
ms.date: 06/13/2022
ms.author: shaas
ms.custom: mode-ui, devx-track-azurecli
#Customer intent: As an IT admin, I need to quickly deploy Data Box Heavy so as to import data into Azure.
---

::: zone target = "docs"

# Quickstart: Deploy Azure Data Box Heavy using the Azure portal

This quickstart describes how to deploy the Azure Data Box Heavy using the Azure portal. The steps include how to cable, configure, and copy data to Data Box Heavy so that it uploads to Azure. The quickstart is performed in the Azure portal and on the local web UI of the device.

For detailed step-by-step deployment and tracking instructions, go to [Tutorial: Order Azure Data Box Heavy](data-box-heavy-deploy-ordered.md)

## Prerequisites

Complete the following configuration prerequisites for the installation site, Data Box service, and device before you deploy the device.

### For installation site

Before you begin, make sure that:

- The device can fit through all your entryways. Device dimensions are: width: 26” length: 48” height: 28”.
- You have access for the device via an elevator or a ramp if you plan to install on a floor other than the ground floor.
- You have two people to handle the device. The device weighs approximately ~500 lbs. and comes on wheels.
- You have a flat site in the datacenter with proximity to an available network connection that can accommodate a device with this footprint.

### For service

[!INCLUDE [Data Box service prerequisites](../../includes/data-box-supported-subscriptions.md)]

### For device

Before you begin, make sure that:

- You've reviewed the [safety guidelines for your Data Box Heavy](data-box-safety.md).
- You have a host computer connected to the datacenter network. Data Box Heavy will copy the data from this computer. Your host computer must run a [supported operating system](data-box-heavy-system-requirements.md).
- You have a laptop with RJ-45 cable to connect to the local UI and configure the device. Use the laptop to configure each node of the device once.
- Your datacenter has high-speed network and you have at least one 10 GbE connection.
- You need one 40-Gbps cable or 10-Gbps cable per device node. Choose cables that are compatible with the Mellanox MCX314A-BCCT network interface:
    - For the 40-Gbps cable, device end of the cable needs to be QSFP+.
    - For the 10-Gbps cable, you need an SFP+ cable that plugs into a 10-G switch on one end, with a QSFP+ to SFP+ adapter (or the QSA adapter) for the end that plugs into the device.
- The power cables are included in a tray at the back of the device.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Order

### [Portal](#tab/azure-portal)

This step takes roughly 5 minutes.

1. Create a new Azure Data Box resource in Azure portal.
2. Select an existing subscription enabled for this service and choose transfer type as **Import**. Provide the **Source country** where the data resides and **Azure destination region** for the data transfer.
3. Select **Data Box Heavy**. The maximum usable capacity is 770 TB and you can create multiple orders for larger data sizes.
4. Enter the order details and shipping information. If the service is available in your region, provide notification email addresses, review the summary, and then create the order.

Once the order is created, the device is prepared for shipment.

### [Azure CLI](#tab/azure-cli)

Use these Azure CLI commands to create a Data Box Heavy job.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

1. Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group or use an existing resource group:

   ```azurecli
   az group create --name databox-rg --location westus 
   ```

1. Use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create a storage account or use an existing storage account:

   ```azurecli
   az storage account create --resource-group databox-rg --name databoxtestsa
   ```

1. Run the [az databox job create](/cli/azure/databox/job#az-databox-job-create) command to create a Data Box job with the **--sku** value of `DataBoxHeavy`:

   ```azurecli
   az databox job create --resource-group databox-rg --name databoxheavy-job \
       --location westus --sku DataBoxHeavy --contact-name "Jim Gan" --phone 4085555555 \
       --city Sunnyvale --email-list JimGan@contoso.com --street-address1 "1020 Enterprise Way" \
       --postal-code 94089 --country US --state-or-province CA --storage-account databoxtestsa \
       --staging-storage-account databoxtestsa --resource-group-for-managed-disk rg-for-md
   ```

   > [!NOTE]
   > Make sure your subscription supports Data Box Heavy.

1. Run the [az databox job update](/cli/azure/databox/job#az-databox-job-update) to update a job, as in this example, where you change the contact name and email:

   ```azurecli
   az databox job update -g databox-rg --name databox-job --contact-name "Robert Anic" --email-list RobertAnic@contoso.com
   ```

   Run the [az databox job show](/cli/azure/databox/job#az-databox-job-show) command to get information about the job:

   ```azurecli
   az databox job show --resource-group databox-rg --name databox-job
   ```

   Use the [az databox job list]( /cli/azure/databox/job#az-databox-job-list) command to see all the Data Box jobs for a resource group:

   ```azurecli
   az databox job list --resource-group databox-rg
   ```

   Run the [az databox job cancel](/cli/azure/databox/job#az-databox-job-cancel) command to cancel a job:

   ```azurecli
   az databox job cancel –resource-group databox-rg --name databox-job --reason "Cancel job."
   ```

   Run the [az databox job delete](/cli/azure/databox/job#az-databox-job-delete) command to delete a job:

   ```azurecli
   az databox job delete –resource-group databox-rg --name databox-job
   ```

1. Use the [az databox job list-credentials]( /cli/azure/databox/job#az-databox-job-list-credentials) command to list credentials for a Data Box job:

   ```azurecli
   az databox job list-credentials --resource-group "databox-rg" --name "databoxdisk-job"
   ```

Once the order is created, the device is prepared for shipment.

---

::: zone-end

::: zone target = "chromeless"

## Cable and connect to your device

After you have reviewed the prerequisites, you'll cable and connect to your device.

::: zone-end

## Cable for power

This step takes about 5 minutes.

When you receive the Data Box Heavy, do the following steps to cable the device for power and turn on the device.

1. If there is any evidence that the device is tampered with or damaged, do not proceed. Contact Microsoft Support to ship you a replacement device.
2. Move the device to installation site and lock the rear wheels.
3. Connect all the four power cables to the power supplies at the back of the device.
4. Use the power buttons in the front plane to turn on the device nodes.

## Cable first node for network

This step takes about 10-15 minutes to complete.

1. Use the RJ-45 CAT 6 network cable to connect your host computer to the management port (MGMT) on the device.
2. Use the Twinax QSFP+ copper cable to connect at least one 40 Gbps (preferred over 1 Gbps) network interface, DATA 1 or DATA 2 for data. If using a 10-Gbps switch, use a Twinax SFP+ copper cable with a QSFP+ to SFP+ adapter (the QSA adapter) to connect the 40-Gbps network interface for data.
3. Cable the device as shown below.  

    ![Data Box Heavy cabled](media/data-box-heavy-quickstart-portal/data-box-heavy-ports-cabled.png)  

## Configure first node

This step takes about 5-7 minutes to complete.

1. To get the device password, go to **General > Device details** in the [Azure portal](https://portal.azure.com). Same password is used for both nodes of the device.
2. Assign a static IP address of 192.168.100.5 and subnet 255.255.255.0 to the Ethernet adapter on the computer you are using to connect to Data Box Heavy. Access the local web UI of the device at `https://192.168.100.10`. The connection could take up to 5 minutes after you turned on the device.
3. Sign in using the password from the Azure portal. You see an error indicating a problem with the website’s security certificate. Follow the browser-specific instructions to proceed to the web page.
4. By default, the network settings for the interfaces (excluding the MGMT) are configured as DHCP. If needed, you can configure these interfaces as static and provide an IP address.

## Cable and configure the second node

This step takes about 15-20 minutes to complete.

Follow the steps used for the first node to cable and configure the second node on the device.  


::: zone target = "docs"

## Copy data

The time to complete this operation depends upon your data size and the speed of the network over which the data is copied.
 
1. Copy data to both the device nodes using both the 40-Gbps data interfaces in parallel.

    - If using a Windows host, use an SMB compatible file copy tool such as [Robocopy](/previous-versions/technet-magazine/ee851678(v=msdn.10)).
    - For NFS host, use `cp` command or `rsync` to copy the data.
2. Connect to the shares on the device using the path:`\\<IP address of your device>\ShareName`. To get the share access credentials, go to the **Connect & copy** page in the local web UI of the Data Box Heavy.
3. Make sure that the share and folder names, and the data follow guidelines described in the [Azure Storage and Data Box Heavy service limits](data-box-heavy-limits.md).

## Prepare to ship

The time to complete this operation depends upon your data size.

1. After the data copy is complete without any errors, go to **Prepare to ship** page in the local web UI and start the ship preparation.
2. After the **Prepare to ship** has completed successfully on both the nodes, turn off the device from the local web UI.

## Ship to Azure

This operation takes about 15-20 minutes to complete.

1. Remove the cables and return them to the tray at the back of the device.
2. Schedule a pickup with your regional carrier.
3. Reach out to [Data Box Operations](mailto:adbops@microsoft.com) to inform regarding the pickup and to get the return shipping label.
4. The return shipping label should be visible on the front clear panel of the device.

## Verify data

The time to complete this operation depends upon your data size.

1. When the Data Box Heavy device is connected to the Azure datacenter network, the data  automatically uploads to Azure.
2. Data Box service notifies you that the data copy is complete via the Azure portal.

    1. Check error logs for any failures and take appropriate actions.
    2. Verify that your data is in the storage account(s) before you delete it from the source.

## Clean up resources

This step takes 2-3 minutes to complete.

- You can cancel the Data Box Heavy order in the Azure portal before the order is processed. Once the order is processed, the order cannot be canceled. The order progresses until it reaches the completed stage. To cancel the order, go to **Overview** and click **Cancel** from the command bar.

- You can delete the order once the status shows as **Completed** or **Canceled** in the Azure portal. To delete the order, go to **Overview** and click **Delete** from the command bar.

## Next steps

In this quickstart, you’ve deployed a Data Box Heavy to help import your data into Azure. To learn more about Azure Data Box Heavy management, advance to the following tutorial:

> [!div class="nextstepaction"]
> [Use the Azure portal to administer Data Box Heavy](data-box-portal-admin.md)

::: zone-end

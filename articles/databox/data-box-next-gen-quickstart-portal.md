---
title: Quickstart for Microsoft Azure Next Gen Data Box Microsoft Docs
description: Learn how to deploy Azure  Next Gen Data Box using the Azure portal for an import order. Configure Azure Data Box device and copy data to upload to Azure.
services: databox
author: stevenmatthew
ms.service: azure-databox
ms.topic: quickstart
ms.date: 11/18/2024
ms.author: shaas
ms.custom: mode-other
#Customer intent: As an IT admin, I need to quickly deploy Data Box so as to import data into Azure.
---

# Get started with Azure Next Gen Data Box

::: zone target="docs"

This quickstart describes how to deploy the Azure Data Box using the Azure portal for an import order. The steps include how to cable, configure, and copy data to Data Box so that it uploads to Azure. The quickstart steps are performed in the Azure portal and on the local web UI of the device.

For detailed step-by-step deployment and tracking instructions, refer to the [Order Data Box](data-box-deploy-ordered.md) tutorial.

::: zone-end 

::: zone target="chromeless"

This guide describes how to deploy the Azure Data Box for import using the Azure portal. The steps include review the prerequisites, cable and connect your device, and copy data to your device so that it uploads to Azure.

::: zone-end

::: zone target="docs"
 
## Prerequisites

Before you begin:

- Make sure that the subscription you use for Data Box service is one of the following types:
    - Microsoft Customer Agreement (MCA) for new subscriptions or Microsoft Enterprise Agreement (EA) for existing subscriptions. Read more about [MCA for new subscriptions](https://www.microsoft.com/licensing/how-to-buy/microsoft-customer-agreement) and [EA subscriptions](https://azure.microsoft.com/pricing/enterprise-agreement/).
    - Cloud Solution Provider (CSP). Learn more about [Azure CSP program](/azure/cloud-solution-provider/overview/azure-csp-overview).
    - Microsoft Azure Sponsorship. Learn more about [Azure sponsorship program](https://azure.microsoft.com/offers/ms-azr-0036p/). 

- Ensure that you have owner or contributor access to the subscription to create a Data Box order.
- Register the [Microsoft.DataBox resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) against this subscription in the Azure portal. 
- Review the [safety guidelines for your Data Box](data-box-safety.md).
- You have a host computer that has the data that you want to copy over to Data Box. Your host computer must
    - Run a [Supported operating system](data-box-system-requirements.md).
    - Be connected to high-speed network. We recommend that you have at least one 100-GbE connection. If a 100-GbE connection isn't available, you can use a 10-GbE or 1-GbE data link, though copy speeds are impacted.
- You must have access to a flat surface where you can place the Data Box. If you want to place the device on a standard rack shelf, you need a 7U slot in your datacenter rack. You can place the device flat or upright in the rack.
- You have the following cables to connect your Data Box to the host computer. These cables are recommended, however, the next generation devices will work with 10G cables too.
    - 2 x 10G-BaseT RJ-45 cables (CAT-5e or CAT6)
    - 2 x 100-GbE QSFP28 passive direct attached cable (use with DATA 1, DATA 2 network interfaces)  

::: zone-end 

::: zone target="chromeless"

## Prerequisites

Before you begin, make sure that:

1. You complete the [Order Azure Data Box](data-box-deploy-ordered.md) tutorial.
2. Your Data Box device is unpacked and the order status in the portal is **Delivered**. 
3. You reviewed the [Data Box safety guidelines](data-box-safety.md).
4. You received one grounded power cord to use with your 120 TB or 525-TB storage device.
5. You have access to a host computer that has the data that you want to copy over to Data Box. Your host computer must
    - Run a [Supported operating system](data-box-system-requirements.md).
    - Be connected to high-speed network. We recommend that you have at least one 100-GbE connection. If a 100-GbE or 10-GbE connection isn't available, a 1-GbE data link is sufficient, though copy speeds are impacted. 
6. You have access to a flat surface to place the Data Box. To place the device flat or upright in a standard rack shelf, you need a 7U slot in your rack.

::: zone-end

::: zone target="docs"

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Order

This step takes roughly 5 minutes.

1. Create a new Azure Data Box resource in Azure portal.
2. Select an existing subscription enabled for this service and choose transfer type as **Import**. Provide the **Source country** where the data resides and **Azure destination region** for the data transfer.
3. Select **Data Box**. The maximum usable capacity is 120 TB or 525 TB and you can create multiple orders for larger data sizes.
4. Enter the order details and shipping information. If the service is available in your region, provide notification email addresses, review the summary, and then create the order.

Once the order is created, the device is prepared for shipment.



## Cable 

This step takes roughly 10 minutes.

When you receive the Data Box, perform the following steps to cable, connect, and turn on the device. This step requires approximately 10 minutes.

1. Don't proceed if evidence of tampering or damage is observed. Contact Microsoft Support to request a replacement device.
2. Before cabling your device, ensure that you have the following cables:
    
   - 1 x power cable (included).
   - 2 x 10G-BaseT RJ-45 cables (CAT-5e or CAT6) (not included).
   - 2 x 100-GbE QSFP28 passive direct attached cable (not included). 

3. Remove and place the device on a flat surface. 
	
4. Cable the device as described in the following steps.

    :::image type="content" source="media/data-box-next-gen-quickstart-import/data-box-cabled-dhcp.png" alt-text="Photograph of a Data Box device backplane cabled.":::

    1. Connect the power cable to the device.
    2. Use the RJ-45 CAT 6 network cable to connect your host computer to the management port (MGMT) on the device. 
    3. Use the QSFP28 copper cable to connect at least one 100 Gbps (preferred over 10 Gbps or 1 Gbps) network interface, DATA 1 or DATA 2 for data. 
    4. Turn on the device. The power button is on the front panel of the device.


## Connect

This step takes about 5-7 minutes to complete.

1. To get the device password, go to **General > Device details** in the [Azure portal](https://portal.azure.com).
2. Assign a static IP address of 192.168.100.5 and subnet 255.255.255.0 to the Ethernet adapter on the computer you're using to connect to Data Box. Access the local web UI of the device at `https://192.168.100.10`. The connection could take up to 5 minutes after you turned on the device. 
3. Sign in using the password from the Azure portal. You see an error indicating a problem with the website’s security certificate. Follow the browser-specific instructions to proceed to the web page.
4. By default, the network settings for the 100-Gbps data interface (or 1 Gbps) are configured as DHCP. If needed, you can configure this interface as static and provide an IP address. 

## Copy data

The time to complete this operation depends upon your data size and network speed.
  
1. If using a Windows host, use an SMB compatible file copy tool such as Robocopy. For NFS host, use `cp` command or `rsync` to copy the data. Connect the tool to your device and begin copying data to the shares. For more information on how to use Robocopy to copy data, go to [Robocopy](/previous-versions/technet-magazine/ee851678(v=msdn.10)).
2. Connect to the shares using the path:`\\<IP address of your device>\ShareName`. To get the share access credentials, go to the **Connect & copy** page in the local web UI of the Data Box.
3. Make sure that the share and folder names, and the data follow guidelines described in the [Azure Storage and Data Box service limits](data-box-limits.md).

## Ship to Azure 

This operation takes about 10-15 minutes to complete.

1. Go to **Prepare to ship** page in the local web UI and start the ship preparation. 
2. After the **Prepare to ship** process completes successfully with no critical errors, download and print the return shipping label.
3. Turn off the device from the local web UI. Remove the cables from the device. 
4. Pack the device in the original box and secure firmly. Paste the return shipping label on the box and remove any previous labels and barcode stickers from the external packaging.
5. Follow local return shipping instructions and ship the device back to Microsoft. 

## Verify data

The time to complete this operation depends upon your data size.

1. When the Data Box device is connected to the Azure datacenter network, the data upload to Azure starts automatically. 
2. Azure Data Box service notifies you that the data copy is complete via the Azure portal. 

    1. Check error logs for any failures and take appropriate actions.
    2. Verify that your data is in the storage accounts before you delete it from the source.

## Clean up resources

This step takes 2-3 minutes to complete.

- You can cancel the Data Box order in the Azure portal before the order is processed. Once the order is processed, the order can't be canceled. The order progresses until it reaches the completed stage. To cancel the order, go to **Overview** and select **Cancel** from the command bar.

- You can delete the order once the status shows as **Completed** or **Canceled** in the Azure portal. To delete the order, go to **Overview** and select **Delete** from the command bar.

## Next steps

In this quickstart, you deployed an Azure Data Box to help import your data into Azure. To learn more about Azure Data Box management, advance to the following tutorial: 

> [!div class="nextstepaction"]
> [Use the Azure portal to administer Data Box](data-box-portal-admin.md)

::: zone-end

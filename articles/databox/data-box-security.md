---
title: Microsoft Azure Data Box security overview | Microsoft Docs in data 
description: Describes Azure Data Box security features in the device, service, and data that resides on Data Box.
services: databox
author: stevenmatthew

ms.service: azure-databox
ms.topic: overview
ms.date: 11/06/2025
ms.author: shaas
zone_pivot_groups: data-box-sku
ms.custom: sfi-image-nochange
# Customer intent: "As a data manager, I want to understand the security features of Azure Data Box, so that I can ensure the protection of sensitive data during transfer and storage."
---

# Azure Data Box security and data protection

Data Box provides a secure solution for data protection by ensuring that only authorized entities can view, modify, or delete your data. This article describes the Azure Data Box security features that help protect each of the Data Box solution components and the data stored on them.

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

## Data flow through components

The Microsoft Azure Data Box solution consists of four main components that interact with each other:

- **Azure Data Box service hosted in Azure** – The management service that you use to create the device order, configure the device, and then track the order to completion.
- **Data Box device** – The transfer device that is shipped to you to import your on-premises data into Azure.
- **Clients/hosts connected to the device** – The clients in your infrastructure that connect to the Data Box device and contain data that needs to be protected.
- **Cloud storage** – The location in the Azure cloud where data is stored. That location is typically the storage account linked to the Azure Data Box resource that you created.

The following diagram shows an import order's on-premises data flow to Azure through the Azure Data Box solution. The various security features within the solution are also highlighted.

:::image type="content" source="media/data-box-security/data-box-security-import.png" alt-text="Diagram explaining Data Box import security.":::

The following diagram shows an export order data flow for your Data Box.

:::image type="content" source="media/data-box-security/data-box-security-export.png" alt-text="Diagram explaining Data Box export security.":::

Logs are generated and event data is tracked as data flows through this solution. For more information, go to:

- [Tracking and event logging for your Azure Data Box import orders](data-box-logs.md).
- [Tracking and event logging for your Azure Data Box export orders](data-box-export-logs.md)

## Security features

Data Box provides a secure solution for data protection by ensuring that only authorized entities can view, modify, or delete your data. The security features for this solution are for the disk and for the associated service ensuring the security of the data stored on them.

### Data Box device protection

The Data Box device is protected by the following features:

:::zone pivot="dbx-ng"
- A rugged device casing that protects against shocks, volatile transportation, and unfavorable environmental conditions.
- Hardware and software tampering detection that prevents further device operations.
- Built-in intrusion detection system that identifies unauthorized physical access to the devices.
- Semper Secure Flash technology integrated with a hardware Root of Trust (RoT) within the flash memory, ensuring firmware integrity and enabling secure updates without hardware modifications.
- A Trusted Platform Module (TPM) that performs hardware-based, security-related functions. The TPM manages and protects secrets and data that needs to be persisted on the device.
- Execution limitations restrict execution to proprietary Data Box-specific software.
- Default locked boot state.
- Device access controlled via a device unlock passkey and encryption key. You can use your own customer-managed key to protect the passkey. For more information, see [Use customer-managed keys in Azure Key Vault for Azure Data Box](data-box-customer-managed-encryption-key-portal.md).
- Access credentials to copy data in and out of the device. Each access to the **Device credentials** page in the Azure portal is logged in the [activity logs](data-box-logs.md#query-activity-logs-during-setup).
- You can use your own passwords for device and share access. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).
:::zone-end

:::zone pivot="dbx"    
- A rugged device casing that protects against shocks, volatile transportation, and unfavorable environmental conditions.
- Hardware and software tampering detection that prevents further device operations.
- A Trusted Platform Module (TPM) that performs hardware-based, security-related functions. The TPM manages and protects secrets and data that needs to be persisted on the device.
- Limits execution to proprietary Data Box-specific software.
- Boots by default into a locked state.
- Device access controlled via a device unlock passkey and encryption key. You can use your own customer-managed key to protect the passkey. For more information, see [Use customer-managed keys in Azure Key Vault for Azure Data Box](data-box-customer-managed-encryption-key-portal.md).
- Access credentials to copy data in and out of the device. Each access to the **Device credentials** page in the Azure portal is logged in the [activity logs](data-box-logs.md#query-activity-logs-during-setup).
- You can use your own passwords for device and share access. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).
:::zone-end

### Establish trust with the device via certificates

A Data Box device lets you utilize your own certificates when connecting to the local web UI and blob storage. For more information, see [Use your own certificates with Data Box devices](data-box-bring-your-own-certificates.md).

### Data Box data protection

The data that flows in and out of Data Box is protected by the following features:

:::zone pivot="dbx-ng"
- AES 256-bit encryption for data-at-rest. In a high-security environment, you can use software-based double encryption. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).
- Software based encryption enhanced by RAID controller-based hardware encryption.
- Encrypted protocols can be used for data-in-flight. We recommend that you use SMB 3.0 with encryption to protect data when you copy to it from your data servers.
- Secure erasure of data from the device once upload to Azure is complete. Data erasure is in accordance with guidelines in [Appendix A for ATA Hard Disk Drives in NIST 800-88r1 standards](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf). The data erasure event is recorded in the [order history](data-box-logs.md#download-order-history).
:::zone-end

:::zone pivot="dbx"
- AES 256-bit encryption for Data-at-rest. In a high-security environment, you can use software-based double encryption. For more information, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).
- Encrypted protocols can be used for data-in-flight. We recommend that you use SMB 3.0 with encryption to protect data when you copy to it from your data servers.
- Secure erasure of data from the device once upload to Azure is complete. Data erasure is in accordance with guidelines in [Appendix A for ATA Hard Disk Drives in NIST 800-88r1 standards](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf). The data erasure event is recorded in the [order history](data-box-logs.md#download-order-history).
:::zone-end

### Data Box service protection

The Data Box service is protected by the following features.

- Access to the Data Box service requires a Data Box-enabled Azure subscription. Individual subscriptions limit access to features within the Azure portal.
- Because the Data Box service is hosted in Azure, it's protected by the Azure security features. For more information about the security features provided by Microsoft Azure, go to the [Microsoft Azure Trust Center](https://www.microsoft.com/TrustCenter/Security/default.aspx).
- Access to the Data Box order can be controlled via the use of Azure roles. For more information, see [Set up access control for Data Box order](data-box-logs.md#set-up-access-control-on-the-order)
- The Data Box service stores the password used to unlock the device.
- The Data box service stores order details and status. The Data Box service deletes this information when the job reaches the terminal state or when you delete the order.

## Managing personal data

The collection and display of personal information by Azure Data Box is limited to the following key instances in the service:

- **Notification settings** - When you create an order, you configure notification settings to use a user's email address. This information is visible to the administrator. The Data Box service deletes this information when the job reaches the terminal state or when you delete the order.

- **Order details** – After the order is created, the shipping address, email, and contact information of users is stored in the Azure portal. This information includes:

  - Contact name
  - Phone number
  - Email
  - Street address
  - City
  - Zip/postal code
  - State
  - Country/Province/Region
  - Carrier account number
  - Shipping tracking number

    The Data Box service deletes order details when the job reaches the terminal state or when you delete the order.

- **Shipping address** – After the order is placed, Data Box service provides the shipping address to shipping partners such as UPS or DHL. 

For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trust-center).


## Security guidelines reference

The following security guidelines are implemented in Data Box:

|Guideline   |Description   |
|------------|--------------|
|[IEC 60529 IP52](https://www.iec.ch/)                                                                                                  | Water and dust protection |
|[ISTA 2A](https://ista.org/docs/2Aoverview.pdf)                                                                                        | Volatile transport conditions endurance |
|[NIST SP 800-147](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-147.pdf)                                       | Secure firmware update  |
|[FIPS 140-2 Level 2](https://csrc.nist.gov/csrc/media/publications/fips/140/2/final/documents/fips1402.pdf)                            | Data protection         |
|Appendix A, for ATA Hard Disk Drives in [NIST SP 800-88r1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf) | Data sanitization       |

## Secure erase media sanitization details

The secure erasure process performed on our devices is compliant with [NIST SP 800-88r1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r1.pdf) and following are the details of the implementation:

|Device   |Data Erasure type   |Tool used   |
|----------------|------------|-------------|
|Azure Data Box | In Public cloud: Crypto Erase <br> In Gov cloud: Crypto Erase + Disk overwrite |ARCCONF tool | 
|Azure Data Box 120  | In Public and Gov cloud: Block Erase |ARCCONF tool | 
|Azure Data Box 525  | In Public and Gov cloud: Block Erase |ARCCONF tool | 
|Azure Data Box Disk   | In Public and Gov cloud: Block Erase |MSECLI tool | 


## Next steps

- Review the [Data Box requirements](data-box-system-requirements.md).
- Understand the [Data Box limits](data-box-limits.md).
- Quickly deploy [Azure Data Box](data-box-quickstart-portal.md) in Azure portal.

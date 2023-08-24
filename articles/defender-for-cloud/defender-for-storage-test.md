---
title: Test the Defender for Storage data security features
description: Learn how to test the Malware Scanning, sensitive data threat detection, and activity monitoring provided by Defender for Storage.
author: dcurwin
ms.author: dacurwin
ms.date: 03/23/2023
ms.topic: how-to
---

# Testing the Defender for Storage data security features

After you [enable Microsoft Defender for Storage](../storage/common/azure-defender-storage-configure.md), you can test the service and run a proof of concept to familiarize yourself with its features and validate the advanced security capabilities effectively protect your storage accounts by generating real security alerts. This guide will walk you through testing various aspects of the security coverage offered by Defender for Storage.

There are three main components to test:

- Malware Scanning (if enabled)
- Sensitive data threat detection (if enabled)
- Activity monitoring

> [!TIP] 
> **A hands-on lab to try out Malware Scanning in Defender for Storage**
> 
> We recommend you try the [Ninja training instructions](https://aka.ms/DfStorage/NinjaTrainingLab) for detailed step-by-step instructions on how to test Malware Scanning end-to-end with setting up responses to scanning results. This is part of the 'labs' project that helps customers get ramped up with Microsoft Defender for Cloud and provide hands-on practical experience with its capabilities. 

## Testing Malware Scanning

Follow these steps to test Malware Scanning after enabling the feature:

1. To verify that the setup is successful, upload a file to the storage account. You can use the Azure portal to [upload a file](../storage/blobs/storage-quickstart-blobs-portal.md#upload-a-block-blob)

1. Inspect new blob index tags:

    1. After uploading the file, view the blob and examine its blob index tags.

    1. You should see two new tags: **Malware Scanning scan result** and **Malware Scanning scan time**.

    1. The blob index tags serve as a helpful way to view the scan results.

1. If you don't see the new blob index tags, select the **Refresh** button.

:::image type="content" source="media/defender-for-storage-test/testing-malware.png" alt-text="Screenshot showing how to upload a file to test the Malware Scan.":::

> [!NOTE]
> Index tags are not supported for ADLS Gen. To test and validate your protection for premium block blobs, look at the generated security alert.

### Upload an EICAR test file to simulate malware upload:

To simulate a malware upload using an EICAR test file, follow these steps:

1. Prepare for the EICAR test file:

    1. Use an EICAR test file instead of real malware to avoid causing damage. Standardized antimalware software treats EICAR test files as malware.

    1. Exclude an empty folder to prevent your endpoint antivirus protection from deleting the file. For Microsoft Defender for Endpoint (MDE) users, refer to [add an exclusion to Windows Security](https://support.microsoft.com/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26#ID0EBF=Windows_11).

1. Create the EICAR test file:

    1. Copy the following string: `X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*`

    1. Paste the string into a .TXT file and save it in the excluded folder.

1. Upload the EICAR test file to your storage account.

1. Verify the **Malware Scanning scan result** index tag:

    1. Check for the **Malware Scanning scan result** index tag with the value **Malicious**.

    1. If the tags are not visible, select the **Refresh** button.

1. Receive a Microsoft Defender for Cloud security alert:

    1. Navigate to **Microsoft Defender for Cloud** using the search bar in Azure.

    1. Select on **Security Alerts**.

1. Review the security alert:

    1. Locate the alert titled **Malicious file uploaded to storage account (Preview)**.

    1. Select on the alert’s **View full details** button to see all the related details.

    1. Learn more about Defender for Storage security alerts in the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md#alerts-azurestorage).

## Testing sensitive data threat detection

To test the sensitive data threat detection feature by uploading test data that represents sensitive information to your storage account, follow these steps:

1. Create a new storage account:

    1. Choose a subscription without Defender for Storage enabled.

    1. Create a new storage account with a random name under the selected subscription.

1. Set up a test container:

    1. Go to the **Containers** blade in the newly created storage account.

    1. Select the **+ Container** button to create a new blob container.

    1. Name the new container **test-container**.

1. Upload test data:

    1. Open a text editing application on your computer, such as Notepad or Microsoft Word.

    1. Create a new file and save it in a format like TXT, CSV, or DOCX.

    1. Add the following string to the file: `ASD 100-22-3333 SSN Text` - this is a test US (United States) SSN (Social Security Number).

        :::image type="content" source="media/defender-for-storage-test/testing-sensitivity-2.png" alt-text="Screenshot showing how to test a file in Malware Scanning for Social Security Number information.":::

    1. Save the file with the updated information.

    1. Upload the file you created to the **test-container** in the storage account.

        :::image type="content" source="media/defender-for-storage-test/testing-sensitivity-3.png" alt-text="Screenshot showing how to upload a file in Malware Scanning to test for Social Security Number information.":::

1. Enable Defender for Storage:

    1. In the Azure portal, go to **Microsoft Defender for Cloud**.

    1. Enable Defender for Storage on the storage account with the Sensitivity Data Discovery feature enabled.

    Allow 1-2 hours for the Sensitive Data Discovery engine to scan the storage account. Be aware that the process may take up to 24 hours to complete.

1. Change access level:

    1. Return to the Containers blade.

    1. Right-click on the **test-container** and select **Change the access level**.

        :::image type="content" source="media/defender-for-storage-test/testing-sensitivity-1.png" alt-text="Screenshot showing how to change the access level for a test of Malware Scanning.":::

    1. Choose the **Container (anonymous read access for containers and blobs)** option and select **OK**.

    The previous step exposes the blob container's content to the internet, which will trigger a security alert within 30-60 minutes.

1. Review the security alert:

    1. Go to the **Security Alerts** blade.

    1. Look for the alert titled **The access level of a sensitive storage blob container was changed to allow unauthenticated public access**.

    1. Select on the alert’s **View full details** button to see all the related details.

        :::image type="content" source="media/defender-for-storage-test/sensitive-data-alert.png" alt-text="Screenshot showing how to see an alert for a test file in Malware Scanning.":::

Learn more about Defender for Storage security alerts in the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md#alerts-azurestorage).

## Testing activity monitoring

To test the activity monitoring feature by simulating access from a Tor exit node to a storage account, follow these steps:

1. Create a new storage account with a random name.

1. Set up a test container:

    1. Go to the **Containers** blade in the storage account.

    1. Select the **+ Container** button to create a new blob container.

    1. Name the new container **test-container-tor**.

1. Upload any file to the **test-container-tor**.

1. Generate a SAS (shared access signatures) token:

    1. Right-click on the uploaded file and select **Generate SAS**.

    1. Select the **Generate SAS token and URL** button.

    1. Copy the Blob SAS URL.

1. Download the file using a Tor browser:

    1. Open a Tor browser.

    1. Paste the SAS URL into the address bar and press Enter.

    1. Download the file when prompted.

    The previous step will trigger a Tor anomaly security alert within 1-3 hours.

1. Review the security alert:

    1. Go to the **Security Alerts** blade.

    1. Look for the alert titled **Access from a Tor exit node to a storage blob container**.

    1. Select on the alert’s **View full details** button to see all the related details.

Learn more about Defender for Storage security alerts in the [reference table for all security alerts in Microsoft Defender for Cloud](alerts-reference.md#alerts-azurestorage).

## Next steps

In this article, you learned how to test data protection and threat detection in Defender for Storage.

Learn more about:

- [Threat response](defender-for-storage-threats-alerts.md)
- [Customizing data sensitivity settings](defender-for-storage-data-sensitivity.md)
- [Threat detection and alerts](defender-for-storage-threats-alerts.md)




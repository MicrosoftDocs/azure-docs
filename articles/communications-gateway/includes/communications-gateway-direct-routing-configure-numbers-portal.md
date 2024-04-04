---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 04/04/2024
---

You can configure numbers directly in the Number Management Portal, or by uploading a CSV file containing number configuration.

1. From the overview page for your Communications Gateway resource, find the **Number Management** section in the sidebar. Select **Accounts**.
1. Select the checkbox next to the enterprise's **Account name** and select **View numbers**.
1. Select **Create numbers**.
1. To configure the numbers directly in the Number Management Portal:
    1. Select **Manual input**.
    1. Select **Enable Teams Direct Routing**.
    1. Optionally, enter a value for **Custom SIP header**.
    1. Add the numbers in **Telephone Numbers**.
    1. Select **Create**.
1. To upload a CSV containing multiple numbers:
    1. Prepare a `.csv` file. It must use the headings shown in the following table, and contain one number per line (up to 10,000 numbers).

        | Heading | Description  | Valid values |
        |---------|--------------|--------------|
        | `telephoneNumber`|The number to upload | E.164 numbers, including `+` and the country code |
        | `accountName` | The account to upload the number to | The name of an existing account |
        | `serviceDetails_teamsDirectRouting_enabled`| Whether Microsoft Teams Direct Routing is enabled | `true` or `false`|
        | `configuration_customSipHeader`| Optional: the value for a SIP custom header. | Can only contain letters, numbers, underscores, and dashes. Can be up to 100 characters in length. |

    1. Select **File Upload**.
    1. Select the `.csv` file that you prepared.
    1. Select **Upload**.
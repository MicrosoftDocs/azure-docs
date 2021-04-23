---
author: burkeholland
ms.service: static-web-apps
ms.topic: include
ms.date: 04/22/2021
ms.author: buhollan
---

1. Select the **Generate code** button.

   ![The domain name field on the add domain screen]()

   This action generates a unique code, which may take up to a minute to process.

1. Select the clipboard icon next to the code to copy the value to your clipboard.

   ![The clipboard icon next to a unique key]()

1. Select the **Close** button.

   ![The Add Custom Domain screen with the close button highlighted]()

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

    > [!NOTE]
    > Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **TXT** record with the following values...

   | Setting             | Value                     |
   | ------------------- | ------------------------- |
   | Type                | TXT                       |
   | Host                | @                         |
   | Value               | Paste from your clipboard |
   | TTL (if applicable) | Leave as default value    |

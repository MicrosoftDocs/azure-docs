---
author: burkeholland
ms.service: static-web-apps
ms.topic: include
ms.date: 04/22/2021
ms.author: buhollan
---

1. Click on the "Generate code" button.

   ![The domain name field on the add domain screen]()

   This will generate a unique code. It may take up to a minute to generate the code.

1. Click on the clipboard icon next to the code to copy the value to your clipboard.

   ![The clipboard icon next to a unique key]()

1. Click the "Close" button.

   ![The Add Custom Domain screen with the close button highlighted]()

1. Sign in to the website of your domain provider.

1. Find the page for managing DNS records. Every domain provider has its own DNS records interface, so consult the provider's documentation. Look for areas of the site labeled **Domain Name**, **DNS**, or **Name Server Management**.

1. Often, you can find the DNS records page by viewing your account information, and then looking for a link such as **My domains**. Go to that page and then look for a link that is named similar to **Zone file**, **DNS Records**, or **Advanced configuration**.

1. Create a new **TXT** record with the following values...

   | Setting             | Value                     |
   | ------------------- | ------------------------- |
   | Type                | TXT                       |
   | Host                | @                         |
   | Value               | Paste from your clipboard |
   | TTL (if applicable) | Leave as default value    |

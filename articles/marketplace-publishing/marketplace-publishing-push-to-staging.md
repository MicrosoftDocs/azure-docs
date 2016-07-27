<properties
   pageTitle="Prepare and test your offer for deployment to the Azure Marketplace | Microsoft Azure"
   description="Detailed instructions on providing marketing content, configuring pricing plans, and testing your offer before deploying to the Azure Marketplace."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="07/27/2016"
   ms.author="hascipio"/>

# Complete the offer creation with marketing content
In this step of the publishing process, you will need to provide certain marketing content and details about your offer and/or SKUs in the Azure Marketplace. For example, you will provide a description of your product, company logos, price plans, details of plans, and other information necessary to push your offer and/or SKU to staging. This information is used as marketing content in the Azure portal. You will begin this process in the [publishing portal][link-pubportal].

## Step 1: Provide Marketplace marketing content
**English is the default and only supported language.** Please ensure that all information provided in the fields is in English. All information can be edited at any time until you push to staging.

  1. Go to the publishing portal, [https://publish.windowsazure.com](https://publish.windowsazure.com).
  2. On the left menu, click the **Marketing** tab.
  3. In the main panel, click the **English (US)** button.

  > [AZURE.IMPORTANT] All fields must have entries, including the images, for you to be able to push to staging.

### Details and plans
1.	Enter the offer title (maximum 50 characters), offer summary (maximum 100 characters), offer long summary (maximum 256 characters), offer description (maximum 1300 characters), logos under the **Details** tab
2.	Enter plan title (maximum 50 characters), plan summary (maximum 100 characters), plan description (maximum 2000 characters) under the **Plans** tab.

    >[AZURE.NOTE] You can use the following HTML tags to format the summary, long summary and description of the offer and plans. The allowed HTML tags are h1, h2, h3, h4, h5, p, ol, ul, li, a[target|href], strong, em, b, i.

3.	Do not enter duplicate text under offer and plan description.
4.	Do not enter duplicate text under plan’s title and offer long summary.
5.	Do not enter duplicate text under plan title and offer summary.
6.  Do not enter identical plan titles for an offer with multiple plans.
7.	Upload images of the required specifications (mentioned in the Publishing Portal) in PNG format, one for each size.
8.	Ensure that the logos follow the Azure Marketplace logo guidelines mentioned below.

  ![drawing](media/marketplace-publishing-push-to-staging/pubportal-marketingcontent-details-02.png)

**Azure Marketplace Logo Guidelines**

All the logos uploaded in the Publishing Portal should follow the below guidelines:

- The Azure design has a simple color palette. Keep the number of primary and secondary colors on your logo low.
- The theme colors of the Azure portal are white and black. Hence avoid using these colors as the background color of your logos. Use some color that would make your logos prominent in the Azure portal. We recommend simple primary colors. **If you are using transparent background, then make sure that the logos/text are not white or black.**
- Do not use a gradient background on the logo.
- Avoid placing text, even your company or brand name, on the logo. The look and feel of your logo should be 'flat' and should avoid gradients.
- The logo should not be stretched.
- Small logo should be of size 40 X 40 px
- Medium logo should be of size 90 X 90 px
- Large logo should be of size 115 X 115 px
- Wide logo should be of size 255 X 115 px
- Hero logo should be of size 815 X 290 px

>[AZURE.NOTE] The Hero logo is optional. The publisher can choose not to upload a Hero logo. However once uploaded the hero icon cannot be deleted from the Publishing portal. At that time, the partner must follow the Azure Marketplace guidelines for Hero icons.

  ![drawing](media/marketplace-publishing-push-to-staging/pubportal-marketingcontent-details-03.png)

**Additional guidelines for the Hero logo icon (optional)**

- The Hero logo is optional. The publisher can choose not to upload a Hero logo. **However once uploaded the hero icon cannot be deleted from the Publishing portal. At that time, the partner must follow the Azure Marketplace guidelines for Hero icons else the offer will not be approved to production.**
- The Publisher Display Name, plan title and the offer long summary are displayed in white font color. Hence you should avoid keeping any light color in the background of the Hero Icon. Black, white and transparent background is not allowed for Hero icons.
- The publisher display name, plan title, the offer long summary and the create button are embedded programmatically inside the Hero logo once the offer goes listed. So you should not enter any text while you are designing the Hero logo. Just leave empty space on the right because the text (i.e. publisher display name, plan title, the offer long summary) will be included programmatically by us over there. The empty space for the text should be 415x100 on the right (and it is offset by 370px from the left).

  ![drawing](media/marketplace-publishing-push-to-staging/pubportal-herobanner.png)

### Links
On the **Links** tab on the left bar, enter any links with information that may help customers. Enter a name and URL for each link.

![drawing](media/marketplace-publishing-push-to-staging/pubportal-marketingcontent-link-01.png)

### Sample images (optional)
> [AZURE.NOTE] Including a sample image is an optional step.
> Even though you can upload multiple sample images in the Publishing portal, only one image (randomly selected by the system) gets displayed in the Azure portal. For this reason, we recommend uploading at most one sample image.

On the **Sample Images** tab on the left menu, upload a new image by clicking **Upload a new image**. If you have an existing image and you would like to replace it, click **Replace image**.

![drawing](media/marketplace-publishing-push-to-staging/pubportal-marketingcontent-sampleimg-01.png)

### Legal
On the **Legal** tab, provide a link to your policies/terms of use. Enter or paste the terms in the large **Terms of Use** box. The character limit for the legal terms of use is 1,000,000 characters.

![drawing](media/marketplace-publishing-push-to-staging/pubportal-marketingcontent-legal-01.png)

**Note:**
For Virtual Machine offers, once an offer/SKU is staged in the Azure Portal, you cannot change the fields given below:

- **Offer Identifier:** [Publishing portal -> Virtual Machines -> your Offer -> VM Images tab -> Offer Identifier]
- **SKU Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
- **Publisher Namespace:** [Publishing portal -> Virtual Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under “Step 2 Register Your Company”) -> Publisher Namespace ->Namespace]

For Virtual Machine offers, once the offer/SKU is listed in the Azure Marketplace, you cannot change the fields given below:

- **Offer Identifier:** [Publishing portal -> Virtual Machines -> select your Offer -> VM Images -> Offer Identifier]
- **SKU Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
- **Publisher Namespace:** [Publishing portal -> Virtual Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under Step 2 Register) Publisher Namespace ->Namespace]
- **Ports:** [Publishing portal -> Virtual Machines -> your Offer -> VM Images tab -> Open Ports]
- **Pricing Change of listed SKU(s)**
- **Billing Model Change of listed SKU(s)**
- **Removal of billing regions of listed SKU(s)**
- **Changing the data disk count of listed SKU(s)**


## Step 2: Set your prices
### Pricing models
|Pricing model |Description |
|---------------|------------------------------------------|
|Base| Flat monthly rate paid at time of purchase; e.g., $10/month.|
|Consumption (a.k.a. usage, meter) | Pay per use, which is defined by the publisher of the offer. Overage cannot be defined per seat, per user, etc., as there is no concept of a fraction of a user or capability to do proration. Usage is reported by the partner on an hourly basis. Customer pays at the of monthly billing cycle, as opposed to up front like monthly plans. |
|Free trial | Customer may use for free, for a limited time, and then pay normal rates thereafter. |
|Free tier | Plan is always free. |
| Migration (a.k.a. conversion or upgrade/downgrade) of plan | Concept of a user moving from their current plan to another acceptable plan; defined by partner. |

**Pricing models available by offer type**

> [AZURE.IMPORTANT] Availability of certain pricing models vary by offer type. See the table below.

| | Base only | Consumption only | Base + consumption |
|---|---|---|---|
| Virtual machine image | No | Yes | No|
| Developer service | Yes | Yes | Yes |
| Data service | Yes | No | No |

### 2.1. Set your VM prices
Presently for virtual machines, we have the following **3 types of billing models:**

- **Hourly:** Customers get charged on a per-hour basis based on the rates set by the publishers on the VM sizes (shared core VMS, 1 core VMS, 4 core VMS,8 core VMS,6 core VMS,32 core VMS,64 core VMS,128 core VMS). In case of **hourly billing** model of the SKUs, the total price will be the summation of the software cost charged by the publisher and the infrastructure cost charged by Microsoft. This total cost will be displayed to the customer as an hourly and monthly price when they are considering the purchase (see the screenshot below). **Publisher receives 80% of the software cost charged by them.** Hence please make the calculation accordingly before setting prices for your SKUs.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1-01.png)

- **Free Trial:** This is another flavor of the Hourly model. Here the customer doesn’t get charged for software cost for the first 30 days(Free) after deploying the VM. After 30days they get charged on a per-hour basis based on the rates set by the publishers in the hourly model.
- **Bring-Your-Own-License (BYOL):** The publishers manage the licensing of the software running on the VM.

**Important:** Once the offer/SKU is listed in the Azure Marketplace, you cannot change the fields given below.

- **Pricing Change of listed SKU(s)**
- **Billing Model Change of listed SKU(s)**
- **Removal of billing regions of listed SKU(s)**
- **Changing the data disk count of listed SKU(s)**
- **Offer Identifier:** [Publishing portal -> Virtual Machines -> select your Offer -> VM Images -> Offer Identifier]
- **SKU Identifier:** [Publishing portal -> Virtual Machines -> Select your Offer -> SKUs tab -> Add a SKU]
- **Publisher Namespace:** [Publishing portal -> Virtual Machines -> Walkthrough tab -> Tell Us About Your Company (Found Under Step 2 Register) Publisher Namespace -> Namespace]
- **Ports:** [Publishing portal -> Virtual Machines -> your Offer -> VM Images tab -> Open Ports]

### “Sell-to” countries of the SKU
You need to carefully consider where you make your SKUs available. Some countries are classified as “Microsoft remit” and others are classified as “ISV remit.”

- In “Microsoft remit” countries, Microsoft collects taxes from customers and pays (remits) taxes to the government.
- In “ISV remit” countries, partners are responsible for collecting taxes customers and paying taxes to the government. If you choose to sell in “ISV remit” countries, you must have the capability to calculate and pay taxes in the countries you select.

>[AZURE.NOTE] Your SKU will not be available in the countries unless you set their pricing in the [Publishing portal](https://publish.windowsazure.com). Guidance to get set the pricing of Hourly and BYOL SKUs is given below.

### 2.1.1 How to setup hourly pricing model for a SKU
Please follow the steps given below to setup Hourly pricing model for a SKU:

1.	Login to the [Publishing portal](https://publish.windowsazure.com).
2.	Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3.	From the left hand side menu, click the **SKUS** tab.
4.	Ensure that the SKU is marked as “Hourly Billing Model”. If not, then click on the **EDIT** button to revert the billing model. A window will open. Uncheck the checkbox ‘Billing and licensing is done externally from Azure (aka Bring Your Own License)’ and save the changes.
5.	If you want to enable Free trial for the first 30days of SKU deployment, then select the option “One Month” for the question “Is a free trial available?” Otherwise, select the option “No Trial”. Now follow the steps given below.
6.	From the left hand side menu, click the **PRICING** tab.
7.	Select your base region.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_07.png)

8. Set the prices for all cores. **You must provide price for all the cores of a SKU even if your SKU does not support it.**

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_08.png)

9.	Set the prices for the other regions manually or you can use the AUTOPRICE wizard to set the prices of other regions based on the base region. To use the AUTOPRICE wizard click on the button **AUTOPRICE OTHER MARKETS BASED ON PRICES IN UNITED STATES.** **Note:** The button’s label may be different depending on the region which you have selected. Since we have selected United States while creating this document, so the button is labeled as “Auto price other markets based on prices in United States” in the screenshot below.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_09.png)

10.	The auto price wizard will open. The first page displays the selection for base market. Make your section and move to the next page by clicking on the “->” button.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_10.png)

11.	Option for selecting the cores and plans will be displayed on the page 2. Select the desired plans and click “->” button. Click the **Toggle All** button to select all the **Service plans** and **Meters** or you can manually check the checkboxes. **You must provide price for all the cores of a SKU even if your SKU does not support it.** Hence ensure that all the core sizes are selected.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_11.png)

12.	Page 3 displays the markets/regions. Click the **Toggle All** button to select all regions or manually check the boxes for region. Click on the “->” button to move to the next page. **Note:** Microsoft Tax Remitted Countries are denoted by a house like symbol. For more details please refer to the section “Sell-to” countries of the SKU of this page.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.1_12.png)

13.	Page 4 displays the exchange rates. Click on the finish button to complete the steps.

### 2.1.2 How to setup BYOL pricing model for a SKU
Please follow the steps given below to setup BYOL pricing model for a SKU:

1.	Login to the [Publishing portal](https://publish.windowsazure.com).
2.	Navigate to the **VIRTUAL MACHINES** tab and select your offer.
3.	From the left hand side menu, click the **SKUS** tab.
4.	Ensure that the SKU is marked as “Bring your own license SKU”. If not, then click on the EDIT button to revert the billing model. A window will open. Check the checkbox ‘Billing and licensing is done externally from Azure (aka Bring Your Own License)’ and save the changes.

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.2_04.png)

5.	From the left hand side menu, click the **PRICING** tab.
6.	Select your base region and make the SKU available in the region by checking the checkbox against the SKU under the section EXTERNALLY-LICENSED (BYOL) SKU AVAILABILITY (see the screenshot below).

    ![drawing](media/marketplace-publishing-push-to-staging/img2.1.2_06.png)

7.	Make the SKU available in the other regions manually or you can use the AUTOPRICE wizard for this purpose. Refer to the points #9 to #13 (which explains the use of the AUTOPRICE wizard) in the section **“2.1.1 How to setup Hourly pricing model for a SKU”** of this page.

### 2.2. Set your Developer service prices
Plans can be any combination of base + consumption, where base is the monthly price and overage is the pay-per-use price. (See below for more details.)

**Example:**  Contoso developer service offering

| Plan | Price | Includes | Migration path |
|-------|------|-------|-------|
|Free|$0/month|Basic functionality.|Can migrate to any other plan|
|Bronze|$10/month|Basic functionality and a quota of 1,000 of feature X.|Can migrate to Bronze Plus, Silver, and Gold plans|
|Bronze Plus|Free trial period: $0/month + $0/meter01 |Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold plans|
|Bronze Plus| Paid period (a.k.a. free trial expired): $10/month + $0.05/meter01|Basic functionality and a quota of 10,000 of feature X.  Once feature X quota is used, the customer can pay per use via meter01.|Can migrate to Silver Plus and Gold plans|
|Silver|$0.15/meter01|The customer can pay per use via meter01, which is for feature X.|Can migrate to Bronze and Gold plans|
|Silver Plus|$20/month + $0.15/meter01 + $0.01/meter02|Basic functionality and a quota of 10,000 of feature X and 100 of feature Y.  Once the feature X quota is used, the customer can pay per use via meter01.  Once the feature Y quota is used, the customer can pay per use via meter02.|Can migrate to Bronze Plus and Gold plans|
|Gold|$1,000/month|Quota of 10,000 of feature X, 1,000 of feature Y, and unlimited of feature Z.|Can migrate to all plans except free|

## Step 3: Provide support information
The contact details are used for internal communications between the partner and Microsoft only. The support URL will be available to the end customers.

1.	Go to the **Support** heading on the left side of the publishing portal.
2.	Enter information under **Engineering Contact**.
3.	Enter information under **Customer Support**. If you provide only email support, enter a dummy phone number, and your provided email will be used instead.
4.	Enter the support URL.

## Step 4: Choose Azure Marketplace categories
The **Categories** tab provides an array of selections. Your offer may fall under these, and you may select up to five categories.

## How your marketing will appear
Below is a detailed view of how the offer marketing information is used on the [Azure Marketplace website](https://azure.microsoft.com/marketplace/) and in the [Azure portal](https://portal.azure.com).

### Azure Marketplace website
![drawing](media/marketplace-publishing-push-to-staging/acom-catalog-01.png)

![drawing](media/marketplace-publishing-push-to-staging/acom-catalog-02.png)

*Listing of offers on the Azure Marketplace website*

![drawing](media/marketplace-publishing-push-to-staging/acom-listing-details-01.png)

*Offer description details on the Azure Marketplace website*

![drawing](media/marketplace-publishing-push-to-staging/acom-listing-details-02.png)

*Offer description pricing details on the Azure Marketplace website*

### Azure Portal
![drawing](media/marketplace-publishing-push-to-staging/azureportal-galleryblade-01.png)

*Listing of offers in the Azure Portal*

![drawing](media/marketplace-publishing-push-to-staging/azureportal-galleryblade-02.png)

*Offer description details in the Azure portal*

## Next steps
Now that your Marketplace content is loaded, let's move forward with testing your offer in staging. However, you must select the appropriate offer type from the list below, as steps vary by offer type.

- [Test your VM offer in staging](marketplace-publishing-vm-image-test-in-staging.md)
- [Test your Solution template offer in staging](marketplace-publishing-solution-template-test-in-staging.md)

## See also

- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-map-acom]:media/marketplace-publishing-push-to-staging/pubportal-mapping-acom.jpg
[img-map-portal]:media/marketplace-publishing-push-to-staging/pubportal-mapping-azure-portal.jpg
[img-map-link]:media/marketplace-publishing-push-to-staging/marketing-content-guide-links.jpg
[img-map-logo]:media/marketplace-publishing-push-to-staging/marketing-content-guide-logos.jpg
[img-map-title]:media/marketplace-publishing-push-to-staging/marketing-content-guide-publisher-offer.png

[link-pubportal]:https://publish.windowsazure.com
[link-push-to-production]:marketplace-publishing-push-to-production.md

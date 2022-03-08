> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/phone-numbers-quickstart)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

- In a terminal or command window, run `node --version` to check that Node.js is installed.

## Setting up

### Create a new Node.js Application

First, open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir phone-numbers-quickstart && cd phone-numbers-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Create a file called **phone-numbers-quickstart.js** in the root of the directory you just created. Add the following snippet to it:

```javascript
async function main() {
    // quickstart code will here
}

main();
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Phone Numbers client library for JavaScript.

```console
npm install @azure/communication-phone-numbers --save
```

The `--save` option adds the library as a dependency in your **package.json** file.

## Authenticate the client

Import the **PhoneNumbersClient** from the client library and instantiate it with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to the top of **phone-numbers-quickstart.js**:

```javascript
const { PhoneNumbersClient } = require('@azure/communication-phone-numbers');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the phone numbers client
const phoneNumbersClient = new PhoneNumbersClient(connectionString);
```

## Manage phone numbers

### Search for available phone numbers

In order to purchase phone numbers, you must first search for available phone numbers. To search for phone numbers, provide the area code, assignment type, [phone number capabilities](../../../concepts/telephony/plan-solution.md#phone-number-capabilities-in-azure-communication-services), [phone number type](../../../concepts/telephony/plan-solution.md#phone-number-types-in-azure-communication-services), and quantity. Note that for the toll-free phone number type, providing the area code is optional.

Add the following snippet to your `main` function:

```javascript
/**
 * Search for Available Phone Number
 */

// Create search request
const searchRequest = {
    countryCode: "US",
    phoneNumberType: "tollFree",
    assignmentType: "application",
    capabilities: {
      sms: "outbound",
      calling: "none"
    },
    areaCode: "833",
    quantity: 1
  };

const searchPoller = await phoneNumbersClient.beginSearchAvailablePhoneNumbers(searchRequest);

// The search is underway. Wait to receive searchId.
const { searchId, phoneNumbers } = await searchPoller.pollUntilDone();
const phoneNumber = phoneNumbers[0];

console.log(`Found phone number: ${phoneNumber}`);
console.log(`searchId: ${searchId}`);
```

### Purchase phone number

The result of searching for phone numbers is a `PhoneNumberSearchResult`. This contains a `searchId` which can be passed to the purchase numbers API to acquire the numbers in the search. Note that calling the purchase phone numbers API will result in a charge to your Azure Account.

Add the following snippet to your `main` function:

```javascript
/**
 * Purchase Phone Number
 */

const purchasePoller = await phoneNumbersClient.beginPurchasePhoneNumbers(searchId);

// Purchase is underway.
await purchasePoller.pollUntilDone();
console.log(`Successfully purchased ${phoneNumber}`);
```

### Update phone number capabilities

With a phone number now purchased, add the following code to update its capabilities:

```javascript
/**
 * Update Phone Number Capabilities
 */

// Create update request.
// This will update phone number to send and receive sms, but only send calls.
const updateRequest = {
  sms: "inbound+outbound",
  calling: "outbound"
};

const updatePoller = await phoneNumbersClient.beginUpdatePhoneNumberCapabilities(
  phoneNumber,
  updateRequest
);

// Update is underway.
await updatePoller.pollUntilDone();
console.log("Phone number updated successfully.");
```

### Get purchased phone number(s)

After a purchasing number, you can retrieve it from the client. Add the following code to your `main` function to get the phone number you just purchased:

```javascript
/**
 * Get Purchased Phone Number
 */

const { capabilities } = await phoneNumbersClient.getPurchasedPhoneNumber(phoneNumber);
console.log("These capabilities:", capabilities, "should be the same as these:", updateRequest, ".");
```

You can also retrieve all the purchased phone numbers.

```javascript
const purchasedPhoneNumbers = await phoneNumbersClient.listPurchasedPhoneNumbers();

for await (const purchasedPhoneNumber of purchasedPhoneNumbers) {
  console.log(`Phone number: ${purchasedPhoneNumber.phoneNumber}, country code: ${purchasedPhoneNumber.countryCode}.`);
}
```

### Release phone number

You can now release the purchased phone number. Add the code snippet below to your `main` function:

```javascript
/**
 * Release Purchased Phone Number
 */

const releasePoller = await phoneNumbersClient.beginReleasePhoneNumber(phoneNumber);

// Release is underway.
await releasePoller.pollUntilDone();
console.log("Successfully release phone number.");
```

## Run the code

Use the `node` command to run the code you added to the **phone-numbers-quickstart.js** file.

```console
node phone-numbers-quickstart.js
```
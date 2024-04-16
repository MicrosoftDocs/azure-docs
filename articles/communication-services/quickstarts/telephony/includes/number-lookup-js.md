Get started with the Phone Numbers client library for JavaScript to look up operator information for phone numbers, which can be used to determine whether and how to communicate with that phone number. Follow these steps to install the package and look up operator information about a phone number.

> [!NOTE]
> Find the code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/lookup-phone-number).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS _(long-term support)_ and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).

### Prerequisite check

In a terminal or command window, run the `node --version` command to check that Node.js is installed.

## Setting up

To set up an environment for sending lookup queries, take the steps in the following sections.

### Create a new Node.js Application

In a terminal or command window, create a new directory for your app and navigate to it.

```console
mkdir number-lookup-quickstart && cd number-lookup-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Create a file called **number-lookup-quickstart.js** in the root of the directory you created. Add the following snippet to it:

```javascript
async function main() {
    // quickstart code will go here
}

main();
```

### Install the package

Use the `npm install` command to install the Azure Communication Services Phone Numbers client library for JavaScript.

```console
npm install @azure/communication-phone-numbers@1.3.0-beta.4 --save
```

The `--save` option adds the library as a dependency in your **package.json** file.

## Code examples

### Authenticate the client

Import the **PhoneNumbersClient** from the client library and instantiate it with your connection string, which can be acquired from an Azure Communication Services resource in the [Azure portal](https://portal.azure.com). Using a `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable is recommended to avoid putting your connection string in plain text within your code. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to the top of **number-lookup-quickstart.js**:

```javascript
const { PhoneNumbersClient } = require('@azure/communication-phone-numbers');

// This code retrieves your connection string from an environment variable
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the phone numbers client
const phoneNumbersClient = new PhoneNumbersClient(connectionString);
```

### Look up phone number formatting

To search for a phone number's operator information, call `searchOperatorInformation` from the `PhoneNumbersClient`.

```javascript
let formattingResults = await phoneNumbersClient.searchOperatorInformation([ "<target-phone-number>" ]);
```

Replace `<target-phone-number>` with the phone number you're looking up, usually a number you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123.

### Look up operator information for a number

To search for a phone number's operator information, call `searchOperatorInformation` from the `PhoneNumbersClient`, passing `true` for the `includeAdditionalOperatorDetails` option.

```javascript
let searchResults = await phoneNumbersClient.searchOperatorInformation([ "<target-phone-number>" ], { "includeAdditionalOperatorDetails": true });
```

> [!WARNING]
> Using this functionality will incur a charge to your account.

### Use operator information

You can now use the operator information. For this quickstart guide, we can print some of the details to the console.

First, we can print details about the number format.

```javascript
let formatInfo = formattingResults.values[0];
console.log(formatInfo.phoneNumber + " is formatted " + formatInfo.internationalFormat + " internationally, and " + formatInfo.nationalFormat + " nationally");
```

Next, we can print details about the phone number and operator.

```javascript
let operatorInfo = searchResults.values[0];
console.log(operatorInfo.phoneNumber + " is a " + (operatorInfo.numberType ? operatorInfo.numberType : "unknown") + " number, operated in "
    + operatorInfo.isoCountryCode + " by " + (operatorInfo.operatorDetails.name ? operatorInfo.operatorDetails.name : "an unknown operator"));
```

You may also use the operator information to determine whether to send an SMS. For more information on sending an SMS, see the [SMS Quickstart](../../sms/send.md).

## Run the code

Run the application from your terminal or command window with the `node` command.

```console
node number-lookup-quickstart.js
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/lookup-phone-number)).

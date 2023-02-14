---
title: Managed AAD Token Based Users in Azure Confidential Ledger
description: Learn how to manage AAD token based users in Azure Confidential Ledger
author: settiy
ms.author: settiy
ms.date: 02/09/2023
ms.service: confidential-ledger
ms.topic: how-to
---

# Manage AAD Token Based Users in Azure Confidential Ledger

AAD-based users are identified by their AAD object id.

Users with Administrator privileges can manage users of the Confidential Ledger. Available roles are Reader (read-only), Contributor (read and write), and Administrator (read, write, and manage users).

The following client libraries are available to manage users. Learn about each by following the links below:

- [Python](#python-client-library)
- [.NET](#.net-client-library)
- [Java](#java-client-library)

## Sign in to Azure

[!INCLUDE [Sign in to Azure](../../includes/confidential-ledger-sign-in-azure.md)]

Get the Confidential Ledger's name and the identity service URI from the Azure Portal as it is needed to create a client to manage the users. The image below shows the appropriate properties in the Azure portal.

:::image type="content" source="./media/ledger-properties.png" alt-text="Ledger Properties":::

Replace instances of `contoso` and  `https://contoso.confidential-ledger.azure.com` in the following code snippets with the respective values from the Azure portal.

## Python Client Library

### Install the packages

```Python
pip install azure-identity azure-confidentialledger
```

### Create a Confidential Ledger client

```Python
from azure.identity import DefaultAzureCredential
from azure.confidentialledger import ConfidentialLedgerClient
from azure.confidentialledger.identity_service import ConfidentialLedgerIdentityServiceClient
from azure.confidentialledger import LedgerUserRole

identity_client = ConfidentialLedgerCertificateClient()
network_identity = identity_client.get_ledger_identity(
    ledger_id="contoso"
    )

ledger_tls_cert_file_name = "ledger_certificate.pem"
with open(ledger_tls_cert_file_name, "w") as cert_file:
    cert_file.write(network_identity["ledgerTlsCertificate"])

# The DefaultAzureCredential will use the current Azure context to authenticate to Azure
credential = DefaultAzureCredential()

ledger_client = ConfidentialLedgerClient(
    endpoint="https://contoso.confidential-ledger.azure.com",
    credential=credential,
    ledger_certificate_path=ledger_tls_cert_file_name
    )

# Add a user with the contributor role
# Other supported roles are Contributor and Administrator
user_id = "AAD object id of the user"
user = ledger_client.create_or_update_user(
user_id, {"assignedRole": "Contributor"}
)

# Get the user and check their properties
user = ledger_client.get_user(user_id)
assert user["userId"] == user_id
assert user["assignedRole"] == "Contributor"

# Delete the user
ledger_client.delete_user(user_id)
```

## .NET Client Library

### Install the packages

```
dotnet add package Azure.Security.ConfidentialLedger
dotnet add package Azure.Identity
dotnet add Azure.Security
```

### Create a client and manage the users

```Dotnet
using Azure.Core;
using Azure.Identity;
using Azure.Security.ConfidentialLedger;

internal class ACLUserManagement
{
    static void Main(string[] args)
    {
      // Create a ConfidentialLedgerClient instance
      // The DefaultAzureCredential will use the current Azure context to authenticate to Azure
      var ledgerClient = new ConfidentialLedgerClient(new Uri("https://contoso.confidential-ledger.azure.com"), new DefaultAzureCredential());

      string userId = "AAD object id of the user";

      // Add the user with the Reader role
      // Other supported roles are Contributor and Administrator
      ledgerClient.CreateOrUpdateUser(
         userId,
         RequestContent.Create(new { assignedRole = "Reader" })); 

      // Get the user and print their properties
      Azure.Response response = ledgerClient.GetUser(userId);
      var aclUser = System.Text.Json.JsonDocument.Parse(response.Content.ToString());

      Console.WriteLine($"Assigned Role is = {aclUser.RootElement.GetProperty("assignedRole").ToString()}");
      Console.WriteLine($"User id is = {aclUser.RootElement.GetProperty("userId").ToString()}");

      // Delete the user
      ledgerClient.DeleteUser(userId);
    }
}
```
## Java Client Library

### Install the packages

```Java
   <!-- https://mvnrepository.com/artifact/com.azure/azure-security-confidentialledger -->
   <dependency>
         <groupId>com.azure</groupId>
         <artifactId>azure-security-confidentialledger</artifactId>
         <version>1.0.6</version>
   </dependency>
   <!-- https://mvnrepository.com/artifact/com.azure/azure-identity -->
      <dependency>
         <groupId>com.azure</groupId>
         <artifactId>azure-identity</artifactId>
         <version>1.8.0</version>
      </dependency>
   <!-- https://mvnrepository.com/artifact/com.azure/azure-core -->
   <dependency>
         <groupId>com.azure</groupId>
         <artifactId>azure-core</artifactId>
         <version>1.36.0</version>
   </dependency>
```

### Create a client and manage the users

```Java
   import java.io.IOException;
import com.azure.core.http.HttpClient;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

import com.azure.security.confidentialledger.*;
import com.azure.core.http.rest.RequestOptions;
import com.azure.core.http.netty.NettyAsyncHttpClientBuilder;
import com.azure.core.http.rest.Response;
import com.azure.core.util.BinaryData;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.azure.security.confidentialledger.certificate.ConfidentialLedgerCertificateClient;
import com.azure.security.confidentialledger.certificate.ConfidentialLedgerCertificateClientBuilder;

import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;

public class CreateOrUpdateUserSample {
	public static void main(String[] args) {
		try {
         	// Download the service identity certificate of the ledger from the well-known identity service endpoint.
         	// Do not change the identity endpoint.
			ConfidentialLedgerCertificateClientBuilder confidentialLedgerCertificateClientbuilder = new ConfidentialLedgerCertificateClientBuilder()
					.certificateEndpoint("https://identity.confidential-ledger.core.azure.com")
					.credential(new DefaultAzureCredentialBuilder().build()).httpClient(HttpClient.createDefault());

			ConfidentialLedgerCertificateClient confidentialLedgerCertificateClient = confidentialLedgerCertificateClientbuilder
					.buildClient();

			String ledgerId = "contoso";
			Response<BinaryData> ledgerCertificateWithResponse = confidentialLedgerCertificateClient
					.getLedgerIdentityWithResponse(ledgerId, null);
			BinaryData certificateResponse = ledgerCertificateWithResponse.getValue();
			ObjectMapper mapper = new ObjectMapper();
			JsonNode jsonNode = mapper.readTree(certificateResponse.toBytes());
			String ledgerTlsCertificate = jsonNode.get("ledgerTlsCertificate").asText();

			SslContext sslContext = SslContextBuilder.forClient()
					.trustManager(new ByteArrayInputStream(ledgerTlsCertificate.getBytes(StandardCharsets.UTF_8)))
					.build();
			reactor.netty.http.client.HttpClient reactorClient = reactor.netty.http.client.HttpClient.create()
					.secure(sslContextSpec -> sslContextSpec.sslContext(sslContext));
			HttpClient httpClient = new NettyAsyncHttpClientBuilder(reactorClient).wiretap(true).build();

         	// The DefaultAzureCredentialBuilder will use the current Azure context to authenticate to Azure
			ConfidentialLedgerClient confidentialLedgerClient = new ConfidentialLedgerClientBuilder()
					.credential(new DefaultAzureCredentialBuilder().build()).httpClient(httpClient)
					.ledgerEndpoint("https://contoso.confidential-ledger.azure.com").buildClient();

			// Add a user
			// Other supported roles are Contributor and Administrator
			BinaryData userDetails = BinaryData.fromString("{\"assignedRole\":\"Reader\"}");
			RequestOptions requestOptions = new RequestOptions();
			String userId = "AAD object id of the user";
			Response<BinaryData> response = confidentialLedgerClient.createOrUpdateUserWithResponse(userId,
					userDetails, requestOptions);

			BinaryData parsedResponse = response.getValue();

			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode responseBodyJson = null;

			try {
				responseBodyJson = objectMapper.readTree(parsedResponse.toBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}

			System.out.println("Assigned role for user is " + responseBodyJson.get("assignedRole"));

			// Get the user and print the details
			response = confidentialLedgerClient.getUserWithResponse(userId, requestOptions);

			parsedResponse = response.getValue();

			try {
				responseBodyJson = objectMapper.readTree(parsedResponse.toBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}

			System.out.println("Assigned role for user is " + responseBodyJson.get("assignedRole"));

			// Delete the user
			confidentialLedgerClient.deleteUserWithResponse(userId, requestOptions);
		} catch (Exception ex) {
			System.out.println("Caught exception" + ex);
		}
	}
}
```
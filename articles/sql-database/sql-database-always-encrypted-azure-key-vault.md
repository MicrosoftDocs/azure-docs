<properties
	pageTitle="Always Encrypted--Protect sensitive data in Azure SQL Database with database encryption"
	description="Protect sensitive data in your SQL database in minutes."
	keywords="data encryption, encryption key, cloud encryption"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor="cgronlun"/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="sstein"/>

# Always Encrypted--Protect sensitive data in a SQL Database with data encryption and store your encryption keys in the Azure Key Vault

> [AZURE.SELECTOR]
- [Azure Key Vault](sql-database-always-encrypted-azure-key-vault.md)
- [Windows certificate store](sql-database-always-encrypted.md)


This article shows you how to secure sensitive data in a SQL database with data encryption using the [Always Encrypted Wizard](https://msdn.microsoft.com/library/mt459280.aspx) in [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/hh213248.aspx) and store each encryption key in the Azure Key Vault.

Always Encrypted is a new data encryption technology in Azure SQL Database and SQL Server that protects sensitive data at rest on the server, during movement between client and server, and while the data is in use. Always Encrypted ensures that sensitive data never appears as plain text inside the database system. After configuring data encryption, only client applications or app servers, that have access to the keys, can access plaintext data. For detailed information, see [Always Encrypted (Database Engine)](https://msdn.microsoft.com/library/mt163865.aspx).


After configuring the database to use Always Encrypted we will create a client application in C# with Visual Studio to work with the encrypted data.

Follow the steps in this article and learn how to setup Always Encrypted for an Azure SQL database. In this article you will learn how to perform the following tasks:

- Use the Always Encrypted wizard in SSMS to create [Always Encrypted Keys](https://msdn.microsoft.com/library/mt163865.aspx#Anchor_3)
    - Create a [Column Master Key (CMK)](https://msdn.microsoft.com/library/mt146393.aspx).
    - Create a [Column Encryption Key (CEK)](https://msdn.microsoft.com/library/mt146372.aspx).
- Create a database table and encrypt some columns.
- Create an application that inserts, selects, and displays data from the encrypted columns.


## Prerequisites

For this tutorial you'll need:

- An Azure account and subscription before you start. If you don't have one, sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- [SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx) version 13.0.700.242 or later.
- [.NET Framework 4.6](https://msdn.microsoft.com/library/w0x726c2.aspx) or later (on the client computer).
- [Visual Studio](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx).
- [Azure PowerShell](../powershell-install-configure.md), minimum version of 1.0.
    - Type **(Get-Module azure -ListAvailable).Version** to see what version of PowerShell you are running.



## Enable your client application to access the SQL Database service

You must first enable your client application to access the SQL Database service by setting up the required authentication and acquiring the *ClientId* and *Secret* that you will need to authenticate your application in the following code.

1. Open the [Classic portal](http://manage.windowsazure.com).
2. Select **Active Directory** in the left menu and click the Active Directory your application will use.
3. Click **Applications** and then click **ADD** (at the botttom).
4. Type a name for your application (for example: *myClientApp*), select **WEB APPLICATION** and click the arrow to continue.
5. For the SIGN-ON URL and APP ID URI you can simply type a valid url (for example: *http://myClientApp*) and continue.
6. Click **CONFIGURE**.
7. Copy your **CLIENT ID** (you will need this value in your code later).
8. In the keys section, set the **Select duration** dropdown to **1 year** (we will copy the key after we save in Step 14).
11. Scroll down and click **Add application**.
12. Leave **SHOW** set to **Microsoft Apps** and then locate and select **Windows Azure Service Management** and click the check-mark to continue.
13. On the **Windows Azure Service Mana...** line click the **Delegated Permissions** dropdown and select **Access Azure Service Management**.
14. Click **SAVE** (at the bottom).
15. After the save completes, locate and copy the key value in the **keys** section (you will need this value in your code later).



## Create an Azure Key Vault to store your keys

Now that your client app is configured and you have your client id, it's time to create an Azure Key Vault and configure it's access policy to allow you and your application to access the vault's secrets (the Always Encrypted keys). To use keys with the Azure Key Vault *create*, *get*, *list*, *sign*, *verify*, *wrapKey*, and *unwrapKey* permissions are required for creating a new column master key and for setting up encryption with SQL Server Management Studio.

You can quickly create an Azure Key Vault by running the following script. For a detailed explanation of these cmdlets and more information about creating and configuring an Azure Key Vault, see [Get started with Azure Key Vault](../Key-Vault/key-vault-get-started.md)



    $subscriptionName = '<your Azure subscription name>'
    $userPrincipalName = '<username@domain.com>'
    $clientId = '<client ID that you copied in step 7 above>'
    $resourceGroupName = '<resource group name>'
    $location = '<datacenter location>'
    $vaultName = 'AeKeyVault'


    Login-AzureRmAccount
    $subscriptionId = (Get-AzureRmSubscription -SubscriptionName $subscriptionName).SubscriptionId
    Set-AzureRmContext -SubscriptionId $subscriptionId

    New-AzureRmResourceGroup –Name $resourceGroupName –Location $location
    New-AzureRmKeyVault -VaultName $vaultName -ResourceGroupName $resourceGroupName -Location $location

    Set-AzureRmKeyVaultAccessPolicy -VaultName $vaultName -ResourceGroupName $resourceGroupName -PermissionsToKeys create,get,wrapKey,unwrapKey,sign,verify,list -UserPrincipalName $userPrincipalName
    Set-AzureRmKeyVaultAccessPolicy  -VaultName $vaultName  -ResourceGroupName $resourceGroupName -ServicePrincipalName $clientId -PermissionsToKeys get,wrapKey,unwrapKey,sign,verify,list




## Create a blank SQL database
1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **New** > **Data + Storage** > **SQL Database**.
3. Create a **Blank** database named **Clinic** on a new or existing server. For detailed directions to create a database in the Azure portal, see [Create a SQL database in minutes](sql-database-get-started.md).

	![create a blank database](./media/sql-database-always-encrypted-azure-key-vault/create-database.png)

You will need the connection string later in the tutorial so after the database is created browse to the new  Clinic database and copy the connection string (you can get the connection string at any time, but we're already in the portal so its easy to copy it now).

1. Click **SQL databases** > **Clinic** > **Show database connection strings**.
2. Copy the connection string for **ADO.NET**:

	![copy the connection string](./media/sql-database-always-encrypted-azure-key-vault/connection-strings.png)


## Connect to the database with SSMS

Open SSMS and connect to the server with the Clinic database.


1. Open SSMS (click **Connect** > **Database Engine...** to open the **Connect to Server** window if it is not open).
2. Enter your server name and credentials. The server name can be found on the SQL database blade and in the connection string you copied earlier. Type the complete server name including *database.windows.net*.

	![copy the connection string](./media/sql-database-always-encrypted-azure-key-vault/ssms-connect.png)

3. If the **New Firewall Rule** window opens, sign in to Azure and let SSMS create a new firewall rule for you.


## Create a table

First we will create a table to hold patient data (not encrypted initially -- we will configure encryption in the next section).

1. Expand **Databases**.
1. Right-click the **Clinic** database and click **New Query**.
2. Paste the following Transact-SQL (T-SQL) into the new query window and **Execute** it:


        CREATE TABLE [dbo].[Patients](
         [PatientId] [int] IDENTITY(1,1),
         [SSN] [char](11) NOT NULL,
         [FirstName] [nvarchar](50) NULL,
         [LastName] [nvarchar](50) NULL,
         [MiddleName] [nvarchar](50) NULL,
         [StreetAddress] [nvarchar](50) NULL,
         [City] [nvarchar](50) NULL,
         [ZipCode] [char](5) NULL,
         [State] [char](2) NULL,
         [BirthDate] [date] NOT NULL
         PRIMARY KEY CLUSTERED ([PatientId] ASC) ON [PRIMARY] );
         GO


## Encrypt some columns (configure Always Encrypted)

SSMS provides a wizard to easily configure Always Encrypted by setting up the column master key (CMK), column encryption (CEK) key, and encrypted columns for you.

1. Expand **Databases** > **Clinic** > **Tables**.
2. Right-click the **Patients** table and select **Encrypt Columns...** to open the Always Encrypted Wizard:

    ![encrypt columns](./media/sql-database-always-encrypted-azure-key-vault/encrypt-columns.png)

3. **Column Selection**

    Click **Next** on the **Introduction** page to open the **Column Selection** page where you select which columns you want to encrypt, [the type of encryption, and what column encryption key (CEK)](https://msdn.microsoft.com/library/mt459280.aspx#Anchor_2) to use.

    For each patient we want to encrypt their **SSN** and **BirthDate** information. The SSN column will use deterministic encryption, which supports equality lookups, joins and group by. The BirthDate column will use randomized encryption, which does not support operations.

    Select and set the **Encryption Type** for the SSN column to **Deterministic**, and the BirthDate column to **Randomized** and then click **Next**.

    ![encrypt columns](./media/sql-database-always-encrypted-azure-key-vault/column-selection.png)

4. **Master Key Configuration** (CMK)

    The **Master Key Configuration** page is where you setup your column master key (CMK) and select the key store provider where the CMK will be stored. Currently, you can store a CMK in the Windows certificate store, the Azure Key Vault, or a hardware security module (HSM).

    This tutorial shows how to store your keys in an Azure Key Vault.

    1.     Select **Azure Key Vault**.
    1.     Select the desired key vault from the dropdown.
    1.     Click **Next**.

    ![master key configuration](./media/sql-database-always-encrypted-azure-key-vault/master-key-configuration.png)


5. **Validation**

    You can encrypt the columns now or save a PowerShell script to run later. For this tutorial select **Proceed to finish now** and click **Next**.

6. **Summary**

    Verify the settings are all correct and click **Finish** to complete the set up for Always Encrypted.


    ![summary](./media/sql-database-always-encrypted-azure-key-vault/summary.png)


### What exactly did the wizard just do?

After the wizard is finished your database is setup for Always Encrypted and the following is completed:

- Created a Column Master Key (CMK) and stored it in your Azure Key Vault.
- Created a Column Encryption Key (CEK) and stored it in your Azure Key Vault.
- Configured the selected columns for encryption. (Our Patients table currently has no data yet but any existing data in the selected columns would now be encrypted.)

You can verify the creation of the keys in SSMS by expanding **Clinic** > **Security** > **Always Encrypted Keys**. You can now see the new keys that the wizard generated for you.


## Create a client application that works with the encrypted data

Now that Always Encrypted is setup lets build an application that does some INSERTS and SELECTS on the encrypted columns.  

> [AZURE.IMPORTANT] Your application must use [SqlParameter](https://msdn.microsoft.com/library/system.data.sqlclient.sqlparameter.aspx) objects when passing plaintext data to the server with Always Encrypted columns. Passing literal values without using SqlParameter objects will result in an exception.


1. Open Visual Studio and create a new C# console application. Make sure your project is set to **.NET Framework 4.6** or later.
2. Name the project **AlwaysEncryptedConsoleAKVApp** and click **OK**.


	![new console application](./media/sql-database-always-encrypted-azure-key-vault/console-app.png)


3. Install the following NuGet packages by clicking **Tools** > **NuGet Package Manager** > **Package Manager Console**.

Run these 2 lines of code in the Package Manager Console:

    Install-Package Microsoft.SqlServer.Management.AlwaysEncrypted.AzureKeyVaultProvider
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory



## Modify your connection string to enable Always Encrypted

This section simply explains how to enable Always Encrypted in your database connection string. It is in the next section **Always Encrypted sample console application** where you will actually modify the console app you just created.


To enable Always Encrypted you need to add the **Column Encryption Setting** keyword to your connection string and set it to **Enabled**.

You can set this directly in the connection string, or you can set it using a [SqlConnectionStringBuilder](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnectionstringbuilder.aspx). The sample application in the next section shows how to use the **SqlConnectionStringBuilder**.



### Enable Always Encrypted in the connection string

Add the following keyword to your connection string:

    Column Encryption Setting=Enabled


### Enable Always Encrypted with a SqlConnectionStringBuilder

The following code shows how to enable Always Encrypted by setting the [SqlConnectionStringBuilder.ColumnEncryptionSetting](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnectionstringbuilder.columnencryptionsetting.aspx) to [Enabled](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnectioncolumnencryptionsetting.aspx).

    // Instantiate a SqlConnectionStringBuilder.
    SqlConnectionStringBuilder connStringBuilder =
       new SqlConnectionStringBuilder("replace with your connection string");

    // Enable Always Encrypted.
    connStringBuilder.ColumnEncryptionSetting =
       SqlConnectionColumnEncryptionSetting.Enabled;

## Register the Azure Key Vault provider

The following code shows how to register the Azure Key Vault provider with the ADO.NET driver:

    private static ClientCredential _clientCredential;

    static void InitializeAzureKeyVaultProvider()
    {
       _clientCredential = new ClientCredential(clientId, clientSecret);

       SqlColumnEncryptionAzureKeyVaultProvider azureKeyVaultProvider =
          new SqlColumnEncryptionAzureKeyVaultProvider(GetToken);

       Dictionary<string, SqlColumnEncryptionKeyStoreProvider> providers =
          new Dictionary<string, SqlColumnEncryptionKeyStoreProvider>();

       providers.Add(SqlColumnEncryptionAzureKeyVaultProvider.ProviderName, azureKeyVaultProvider);
       SqlConnection.RegisterColumnEncryptionKeyStoreProviders(providers);
    }



## Always Encrypted sample console application

This sample demonstrates how to:

- Modify your connection string to enable Always Encrypted.
- Register the Azure Key Vault as the application's key store provider.  
- Insert data into the encrypted columns.
- Select a record by filtering for a specific value in an encrypted column.

Replace the contents of **Program.cs** with the following. Replace the connection string for the global connectionString variable in the line directly preceding the Main method with your valid connection string from the Azure Portal. This is the only change you need to make to this code.

Now run the app to see Always Encrypted in action.

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Data;
    using System.Data.SqlClient;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using Microsoft.SqlServer.Management.AlwaysEncrypted.AzureKeyVaultProvider;

    namespace AlwaysEncryptedConsoleAKVApp
    {
    class Program
    {
        // Update this line with your Clinic database connection string from the Azure Portal.
        static string connectionString = @"<connection string from the portal>";
        static string clientId = @"<client id from step 7 above>";
        static string clientSecret = "<key from step 13 above>";


        static void Main(string[] args)
        {
            InitializeAzureKeyVaultProvider();

            Console.WriteLine("Signed in as: " + _clientCredential.ClientId);

            Console.WriteLine("Original connection string copied from the Azure portal:");
            Console.WriteLine(connectionString);

            // Create a SqlConnectionStringBuilder.
            SqlConnectionStringBuilder connStringBuilder =
                new SqlConnectionStringBuilder(connectionString);

            // Enable Always Encrypted for the connection.
            // This is the only change specific to Always Encrypted
            connStringBuilder.ColumnEncryptionSetting =
                SqlConnectionColumnEncryptionSetting.Enabled;

            Console.WriteLine(Environment.NewLine + "Updated connection string with Always Encrypted enabled:");
            Console.WriteLine(connStringBuilder.ConnectionString);

            // Update the connection string with a password supplied at runtime.
            Console.WriteLine(Environment.NewLine + "Enter server password:");
            connStringBuilder.Password = Console.ReadLine();


            // Assign the updated connection string to our global variable.
            connectionString = connStringBuilder.ConnectionString;


            // Delete all records to restart this demo app.
            ResetPatientsTable();

            // Add sample data to the Patients table.
            Console.Write(Environment.NewLine + "Adding sample patient data to the database...");

            InsertPatient(new Patient()
            {
                SSN = "999-99-0001",
                FirstName = "Orlando",
                LastName = "Gee",
                BirthDate = DateTime.Parse("01/04/1964")
            });
            InsertPatient(new Patient()
            {
                SSN = "999-99-0002",
                FirstName = "Keith",
                LastName = "Harris",
                BirthDate = DateTime.Parse("06/20/1977")
            });
            InsertPatient(new Patient()
            {
                SSN = "999-99-0003",
                FirstName = "Donna",
                LastName = "Carreras",
                BirthDate = DateTime.Parse("02/09/1973")
            });
            InsertPatient(new Patient()
            {
                SSN = "999-99-0004",
                FirstName = "Janet",
                LastName = "Gates",
                BirthDate = DateTime.Parse("08/31/1985")
            });
            InsertPatient(new Patient()
            {
                SSN = "999-99-0005",
                FirstName = "Lucy",
                LastName = "Harrington",
                BirthDate = DateTime.Parse("05/06/1993")
            });


            // Fetch and display all patients.
            Console.WriteLine(Environment.NewLine + "All the records currently in the Patients table:");

            foreach (Patient patient in SelectAllPatients())
            {
                Console.WriteLine(patient.FirstName + " " + patient.LastName + "\tSSN: " + patient.SSN + "\tBirthdate: " + patient.BirthDate);
            }

            // Get patients by SSN.
            Console.WriteLine(Environment.NewLine + "Now lets locate records by searching the encrypted SSN column.");

            string ssn;

            // This very simple validation only checks that the user entered 11 characters.
            // In production be sure to check all user input and use the best validation for your specific application.
            do
            {
                Console.WriteLine("Please enter a valid SSN (ex. 999-99-0003):");
                ssn = Console.ReadLine();
            } while (ssn.Length != 11);

            // The example allows duplicate SSN entries so we will return all records
            // that match the provided value and store the results in selectedPatients.
            Patient selectedPatient = SelectPatientBySSN(ssn);

            // Check if any records were returned and display our query results.
            if (selectedPatient != null)
            {
                Console.WriteLine("Patient found with SSN = " + ssn);
                Console.WriteLine(selectedPatient.FirstName + " " + selectedPatient.LastName + "\tSSN: "
                    + selectedPatient.SSN + "\tBirthdate: " + selectedPatient.BirthDate);
            }
            else
            {
                Console.WriteLine("No patients found with SSN = " + ssn);
            }

            Console.WriteLine("Press Enter to exit...");
            Console.ReadLine();
        }


        private static ClientCredential _clientCredential;

        static void InitializeAzureKeyVaultProvider()
        {

            _clientCredential = new ClientCredential(clientId, clientSecret);

            SqlColumnEncryptionAzureKeyVaultProvider azureKeyVaultProvider =
              new SqlColumnEncryptionAzureKeyVaultProvider(GetToken);

            Dictionary<string, SqlColumnEncryptionKeyStoreProvider> providers =
              new Dictionary<string, SqlColumnEncryptionKeyStoreProvider>();

            providers.Add(SqlColumnEncryptionAzureKeyVaultProvider.ProviderName, azureKeyVaultProvider);
            SqlConnection.RegisterColumnEncryptionKeyStoreProviders(providers);
        }

        public async static Task<string> GetToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            AuthenticationResult result = await authContext.AcquireTokenAsync(resource, _clientCredential);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain the access token");
            return result.AccessToken;
        }

        static int InsertPatient(Patient newPatient)
        {
            int returnValue = 0;

            string sqlCmdText = @"INSERT INTO [dbo].[Patients] ([SSN], [FirstName], [LastName], [BirthDate])
     VALUES (@SSN, @FirstName, @LastName, @BirthDate);";

            SqlCommand sqlCmd = new SqlCommand(sqlCmdText);


            SqlParameter paramSSN = new SqlParameter(@"@SSN", newPatient.SSN);
            paramSSN.DbType = DbType.AnsiStringFixedLength;
            paramSSN.Direction = ParameterDirection.Input;
            paramSSN.Size = 11;

            SqlParameter paramFirstName = new SqlParameter(@"@FirstName", newPatient.FirstName);
            paramFirstName.DbType = DbType.String;
            paramFirstName.Direction = ParameterDirection.Input;

            SqlParameter paramLastName = new SqlParameter(@"@LastName", newPatient.LastName);
            paramLastName.DbType = DbType.String;
            paramLastName.Direction = ParameterDirection.Input;

            SqlParameter paramBirthDate = new SqlParameter(@"@BirthDate", newPatient.BirthDate);
            paramBirthDate.SqlDbType = SqlDbType.Date;
            paramBirthDate.Direction = ParameterDirection.Input;

            sqlCmd.Parameters.Add(paramSSN);
            sqlCmd.Parameters.Add(paramFirstName);
            sqlCmd.Parameters.Add(paramLastName);
            sqlCmd.Parameters.Add(paramBirthDate);

            using (sqlCmd.Connection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlCmd.Connection.Open();
                    sqlCmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    returnValue = 1;
                    Console.WriteLine("The following error was encountered: ");
                    Console.WriteLine(ex.Message);
                    Console.WriteLine(Environment.NewLine + "Press Enter key to exit");
                    Console.ReadLine();
                    Environment.Exit(0);
                }
            }
            return returnValue;
        }


        static List<Patient> SelectAllPatients()
        {
            List<Patient> patients = new List<Patient>();


            SqlCommand sqlCmd = new SqlCommand(
              "SELECT [SSN], [FirstName], [LastName], [BirthDate] FROM [dbo].[Patients]",
                new SqlConnection(connectionString));


            using (sqlCmd.Connection = new SqlConnection(connectionString))

            using (sqlCmd.Connection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlCmd.Connection.Open();
                    SqlDataReader reader = sqlCmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            patients.Add(new Patient()
                            {
                                SSN = reader[0].ToString(),
                                FirstName = reader[1].ToString(),
                                LastName = reader["LastName"].ToString(),
                                BirthDate = (DateTime)reader["BirthDate"]
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            }

            return patients;
        }


        static Patient SelectPatientBySSN(string ssn)
        {
            Patient patient = new Patient();

            SqlCommand sqlCmd = new SqlCommand(
                "SELECT [SSN], [FirstName], [LastName], [BirthDate] FROM [dbo].[Patients] WHERE [SSN]=@SSN",
                new SqlConnection(connectionString));

            SqlParameter paramSSN = new SqlParameter(@"@SSN", ssn);
            paramSSN.DbType = DbType.AnsiStringFixedLength;
            paramSSN.Direction = ParameterDirection.Input;
            paramSSN.Size = 11;

            sqlCmd.Parameters.Add(paramSSN);


            using (sqlCmd.Connection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlCmd.Connection.Open();
                    SqlDataReader reader = sqlCmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            patient = new Patient()
                            {
                                SSN = reader[0].ToString(),
                                FirstName = reader[1].ToString(),
                                LastName = reader["LastName"].ToString(),
                                BirthDate = (DateTime)reader["BirthDate"]
                            };
                        }
                    }
                    else
                    {
                        patient = null;
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
            return patient;
        }


        // This method simply deletes all records in the Patients table to reset our demo.
        static int ResetPatientsTable()
        {
            int returnValue = 0;

            SqlCommand sqlCmd = new SqlCommand("DELETE FROM Patients");
            using (sqlCmd.Connection = new SqlConnection(connectionString))
            {
                try
                {
                    sqlCmd.Connection.Open();
                    sqlCmd.ExecuteNonQuery();

                }
                catch (Exception ex)
                {
                    returnValue = 1;
                }
            }
            return returnValue;
        }
    }

    class Patient
    {
        public string SSN { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
    }
    }



## Verify that the data is encrypted

For a quick check that the actual data on the server is encrypted we can easily query the patients data with SSMS (using our current connection where Column Encryption Setting is not yet enabled).

Run the following query on the Clinic database:

    SELECT FirstName, LastName, SSN, BirthDate FROM Patients;

You can see the encrypted columns do not contain any plaintext data.

   ![new console application](./media/sql-database-always-encrypted-azure-key-vault/ssms-encrypted.png)


To use SSMS to access the plaintext data we can add the **Column Encryption Setting=enabled** parameter to the connection.

1. In SSMS, right-click your server in **Object Explorer** and **Disconnect**.
2. Click **Connect** > **Database Engine** to open the **Connect to Server** window and click **Options**.
3. Click **Additional Connection Parameters** and type **Column Encryption Setting=enabled**.

	![new console application](./media/sql-database-always-encrypted-azure-key-vault/ssms-connection-parameter.png)

4. Run the following query on the Clinic database:

        SELECT FirstName, LastName, SSN, BirthDate FROM Patients;

     You can now see the plaintext data in the encrypted columns.


	![new console application](./media/sql-database-always-encrypted-azure-key-vault/ssms-plaintext.png)


## Next steps
After creating a database that uses Always Encrypted you may want to do the following:

- [Rotate and cleanup your keys](https://msdn.microsoft.com/library/mt607048.aspx).
- [Migrate data that is already encrypted with Always Encrypted](https://msdn.microsoft.com/library/mt621539.aspx)



## Related information

- [Always Encrypted (client development)](https://msdn.microsoft.com/library/mt147923.aspx)
- [Transparent data encryption](https://msdn.microsoft.com/library/bb934049.aspx)
- [SQL Server encryption](https://msdn.microsoft.com/library/bb510663.aspx)
- [Always Encrypted wizard](https://msdn.microsoft.com/library/mt459280.aspx)
- [Always Encrypted blog](http://blogs.msdn.com/b/sqlsecurity/archive/tags/always-encrypted/)

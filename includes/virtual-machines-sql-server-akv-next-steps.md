## Next steps
After enabling Azure Key Vault Integration, you can enable SQL Server encryption on your SQL VM. First, you will need to create an asymmetric key inside your key vault and a symmetric key within SQL Server on your VM. Then, you will be able to execute T-SQL statements to enable encryption for your databases and backups.

There are several forms of encryption you can take advantage of:

- [Transparent Data Encryption (TDE)](https://msdn.microsoft.com/library/bb934049.aspx)
- [Encrypted backups](https://msdn.microsoft.com/library/dn449489.aspx)
- [Column Level Encryption (CLE)](https://msdn.microsoft.com/library/ms173744.aspx)

The following Transact-SQL scripts provide examples for each of these areas.

>[AZURE.NOTE] Each example is based on the two prerequisites: an asymmetric key from your key vault called **CONTOSO_KEY** and a credential created by the AKV Integration feature called **Azure_EKM_TDE_cred**.

### Transparent Data Encryption (TDE)
1. Create a SQL Server login to be used by the Database Engine for TDE, then add the credential to it.
	
		USE master;
		-- Create a SQL Server login associated with the asymmetric key 
		-- for the Database engine to use when it loads a database 
		-- encrypted by TDE.
		CREATE LOGIN TDE_Login 
		FROM ASYMMETRIC KEY CONTOSO_KEY;
		GO
		
		-- Alter the TDE Login to add the credential for use by the 
		-- Database Engine to access the key vault
		ALTER LOGIN TDE_Login 
		ADD CREDENTIAL Azure_EKM_TDE_cred;
		GO
	
2. Create the database encryption key that will be used for TDE.
	
		USE ContosoDatabase;
		GO
		
		CREATE DATABASE ENCRYPTION KEY 
		WITH ALGORITHM = AES_128 
		ENCRYPTION BY SERVER ASYMMETRIC KEY CONTOSO_KEY;
		GO
		
		-- Alter the database to enable transparent data encryption.
		ALTER DATABASE ContosoDatabase 
		SET ENCRYPTION ON;
		GO

### Encrypted backups
1. Create a SQL Server login to be used by the Database Engine for encrypting backups, and add the credential to it.
	
		USE master;
		-- Create a SQL Server login associated with the asymmetric key 
		-- for the Database engine to use when it is encrypting the backup.
		CREATE LOGIN Backup_Login 
		FROM ASYMMETRIC KEY CONTOSO_KEY;
		GO 
		
		-- Alter the Encrypted Backup Login to add the credential for use by 
		-- the Database Engine to access the key vault
		ALTER LOGIN Backup_Login 
		ADD CREDENTIAL Azure_EKM_Backup_cred ;
		GO
	
2. Backup the database specifying encryption with the asymmetric key stored in the key vault.
	
		USE master;
		BACKUP DATABASE [DATABASE_TO_BACKUP]
		TO DISK = N'[PATH TO BACKUP FILE]' 
		WITH FORMAT, INIT, SKIP, NOREWIND, NOUNLOAD, 
		ENCRYPTION(ALGORITHM = AES_256, SERVER ASYMMETRIC KEY = [CONTOSO_KEY]);
		GO

### Column Level Encryption (CLE)
This script creates a symmetric key protected by the asymmetric key in the key vault, and then uses the symmetric key to encrypt data in the database.

	CREATE SYMMETRIC KEY DATA_ENCRYPTION_KEY
	WITH ALGORITHM=AES_256
	ENCRYPTION BY ASYMMETRIC KEY CONTOSO_KEY;
	
	DECLARE @DATA VARBINARY(MAX);
	
	--Open the symmetric key for use in this session
	OPEN SYMMETRIC KEY DATA_ENCRYPTION_KEY 
	DECRYPTION BY ASYMMETRIC KEY CONTOSO_KEY;
	
	--Encrypt syntax
	SELECT @DATA = ENCRYPTBYKEY(KEY_GUID('DATA_ENCRYPTION_KEY'), CONVERT(VARBINARY,'Plain text data to encrypt'));
	
	-- Decrypt syntax
	SELECT CONVERT(VARCHAR, DECRYPTBYKEY(@DATA));
	
	--Close the symmetric key
	CLOSE SYMMETRIC KEY DATA_ENCRYPTION_KEY;

## Additional resources
For more information on how to use these encryption features, see [Using EKM with SQL Server Encryption Features](https://msdn.microsoft.com/library/dn198405.aspx#UsesOfEKM).

Note that the steps in this article assume that you already have SQL Server running on an Azure virtual machine. If not, see [Provision a SQL Server virtual machine in Azure](../articles/virtual-machines/virtual-machines-windows-portal-sql-server-provision.md). For other guidance on running SQL Server on Azure VMs, see [SQL Server on Azure Virtual Machines overview](../articles/virtual-machines/virtual-machines-windows-sql-server-iaas-overview.md).

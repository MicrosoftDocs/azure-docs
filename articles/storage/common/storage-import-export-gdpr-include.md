## GDPR compliance

[General Data Protection Regulation (GDPR)](http://ec.europa.eu/justice/data-protection/reform) is a European Union (EU) data protection and privacy law. The GDPR laws relate to how personal information is used, collected, and stored. These rules are imposed on companies, government agencies, and other organizations that operate in the EU and collect and analyze data that is tied to EU residents.

The Azure Import/Export service is GDPR-compliant. Personal information is relevant to the service (via the portal and API) during import and export operations. Data used during these processes include:

- Contact name
- Phone number
- Email
- Street address
- City
- Zip/postal code
- State
- Country/Province/Region
- Drive ID
- Carrier account number
- Shipping tracking number

> [!IMPORTANT]
> By default, personal identifiable information is purged on all completed jobs.

When an Import/Export job is created, the users provide contact information and a shipping address. Personal information is saved in the job and deleted with the job. Users can delete jobs manually and completed jobs are automatically deleted after 90 days. 

Jobs can be deleted via the REST API or  via the Azure portal. To delete the job in the Azure portal, go to your Import/Export job, and click *Delete* from the command bar. For more information on Import/Export job deletion via REST API, go to [Delete an Import/Export job](storage-import-export-cancelling-and-deleting-jobs.md).


For more information, review the Microsoft Privacy policy at [Trust Center](https://www.microsoft.com/trustcenter
##Highly available solutions with Azure traffic manager

You need to determine whether your workload's high availability requirements can be met by using Azure traffic manager alone, or if you need to combine traffic manager with other DNS solutions, or processes. Depending on your needs, you can use:

- **Traffic manager alone**. If a 99.99% up time is sufficient for your workload, you can use traffic manager by itself. In the event of failure in the traffic manager service, users will not be able to access your workload until the traffic manager service is reestablished.

- **Use another traffic manager solution along with Azure traffic manager**. In the event of failure in the traffic manager service, you can change your CNAME record to point to the other traffic manager service. Access to your workload is still available, and distributed to all locations hosting your workload. This is the most expensive solution, but may be required for workloads that need a higher SLA.

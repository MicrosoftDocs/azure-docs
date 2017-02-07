### Troubleshooting Azure Diagnostics

If you receive the following error message:

`Failed to update diagnostics for 'resource'. {"code":"Forbidden","message":"Please register the subscription 'subscription id' with Microsoft.Insights."}`

You can resolve the error by performing the following steps in the Azure portal:

1.	In the navigation pane on the left, click on *Subscriptions*
2.	Seect the subscription identified in the error message
3.	Click on *Resource Providers*
4.	Find the *Microsoft.insights* provider
5.	Click on the *Register* link

Once the *Microsoft.insights* is registered, retry configuring diagnostics.

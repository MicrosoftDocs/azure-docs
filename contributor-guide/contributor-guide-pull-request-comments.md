# Pull request comment automation
We use comment automation in pull request comments to allow contributors and authors to assign labels that drive the pull request review process.

| Comment | What it does | Availability |
| --- | --- | --- |
| #sign-off |When the author of an article types the **#sign-off** comment in the comment stream, the **ready-to-merge** label is assigned. |Public and private |
| #sign-off |If a contributor who is NOT the listed author tries to sign off on a public pull request using the **#sign-off** comment, a message is written to the pull request indicating the label can be assigned only by the author. |Public |
| #hold-off |If you type **#hold-off** in a pull request comment, it removes the **ready-to-merge** label - in case you change your mind or make a mistake. In the private repo, this assigns the **do-not-merge** label. |Public and private |
| #please-close |Authors can type the **#please-close** comment in the comment stream of a pull request to close it if you decide not to have the changes merged. |Public |

## Troubleshooting sign-offs in the public repo
The public repo sign off automation is allows only the author to sign off. Some manual exception processing may be needed:

* **Article authors**: To use the public repository comment automation, your actual GitHub account must EXACTLY match the GitHub account listed in the article metadata. The capitalization of your account matters. If you are blocked from signing off due to this problem, send mail to the azdocprs alias.
* **Other employees**: If you are an employee who is signing off on behalf of the author and you are blocked by the automation, contact azdocprs with the pull request link. Indicate who you are -- PMs on the same product team, colleagues on the writing team, and writing team managers are considered trusted sources.

## Related
* [Pull request etiquette and best practices for Microsoft contributors](contributor-guide-pull-request-etiquette.md)
* [Quality criteria for pull request review](contributor-guide-pr-criteria.md)


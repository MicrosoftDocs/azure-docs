import itertools
import json
from pathlib import Path
import subprocess
import unittest

import yaml


ROOT = Path(__file__).resolve().parents[2]
WORKFLOWS = ROOT / ".github" / "workflows"
SCAN = "stale-comment-knowledgepartnership.yml"
ENROLL = "stale-enroll-knowledgepartnership.yml"
CONFIG = "reusable-kp-configuration.yml"
PRIVATE_REPO = "MicrosoftDocs/azure-docs-pr"


class UniqueKeyLoader(yaml.BaseLoader):
    def construct_mapping(self, node, deep=False):
        result = {}
        for key_node, value_node in node.value:
            key = self.construct_object(key_node, deep=deep)
            if key in result:
                raise ValueError(f"Duplicate YAML key: {key}")
            result[key] = self.construct_object(value_node, deep=deep)
        return result


def load(filename):
    return yaml.load((WORKFLOWS / filename).read_text(encoding="utf-8"), Loader=UniqueKeyLoader)


class KnowledgePartnershipWorkflows(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflows = {path.name: load(path.name) for path in sorted(itertools.chain(WORKFLOWS.glob("*.yml"), WORKFLOWS.glob("*.yaml")))}
        cls.scan = cls.workflows[SCAN]
        cls.enroll = cls.workflows[ENROLL]
        cls.config = cls.workflows[CONFIG]

    def test_entry_points_have_distinct_names_and_triggers(self):
        self.assertEqual(self.scan["name"], Path(SCAN).stem)
        self.assertEqual(self.enroll["name"], Path(ENROLL).stem)
        self.assertEqual(set(self.scan["on"]), {"schedule", "workflow_dispatch"})
        self.assertEqual(self.scan["on"]["schedule"], [{"cron": "0 * * * *"}])
        self.assertEqual(set(self.enroll["on"]), {"pull_request_target"})
        self.assertEqual(
            self.enroll["on"]["pull_request_target"]["types"],
            ["opened", "reopened", "ready_for_review", "edited", "synchronize"],
        )
        self.assertEqual(
            self.scan["on"]["workflow_dispatch"]["inputs"]["labels-only"]["default"], "false"
        )
        self.assertIn("no reminders", self.enroll["run-name"])
        self.assertIn("no reminders", self.scan["run-name"])

    def test_settings_have_one_source_and_are_exposed_to_both_callers(self):
        self.assertNotIn("env", self.scan)
        self.assertNotIn("env", self.enroll)
        self.assertEqual(set(self.config["on"]), {"workflow_call"})
        self.assertEqual(self.config["permissions"], {})
        self.assertEqual(self.config["env"]["INACTIVITY_DAYS"], "3")
        self.assertEqual(self.config["env"]["OPERATIONS_PER_RUN"], "350")
        outputs = self.config["on"]["workflow_call"]["outputs"]
        job_outputs = self.config["jobs"]["configuration"]["outputs"]
        self.assertEqual(set(outputs), set(job_outputs))
        for key, output in outputs.items():
            self.assertEqual(output["value"], "${{ jobs.configuration.outputs." + key + " }}")
            setting = job_outputs[key].removeprefix("${{ env.").removesuffix(" }}")
            self.assertIn(setting, self.config["env"])
        for caller in [self.scan, self.enroll]:
            self.assertEqual(caller["jobs"]["configuration"]["uses"], f"./.github/workflows/{CONFIG}")
            self.assertEqual(caller["jobs"]["configuration"]["permissions"], {})

    def test_stale_bots_share_single_keep_open_exemption(self):
        self.assertEqual(self.config["env"]["EXEMPT_LABEL"], "keep-open")
        general_steps = self.workflows["stale.yml"]["jobs"]["stale"]["steps"]
        general = next(step["with"] for step in general_steps if "uses" in step)
        self.assertIn("keep-open", general["exempt-pr-labels"].split(","))
        for caller in [self.scan, self.enroll]:
            for job in caller["jobs"].values():
                if "exempt-label" in job.get("with", {}):
                    self.assertEqual(
                        job["with"]["exempt-label"],
                        "${{ needs.configuration.outputs.exempt-label }}",
                    )
        reminder = self.workflows["reusable-kp-reminder.yml"]["jobs"]["send-reminders"]
        self.assertEqual(reminder["env"]["EXEMPT_LABEL"], "${{ inputs.exempt-label }}")
        actions = [step["with"] for step in reminder["steps"]
                   if (step.get("uses", "").startswith("actions/stale@") or step.get("uses") == "./.kp-stale-action")]
        for action in actions:
            self.assertEqual(action["exempt-pr-labels"], "${{ env.EXEMPT_LABEL }}")
            self.assertEqual(action["exempt-draft-pr"], "true")
        validation = self.workflows["reusable-kp-validate-labels.yml"]["jobs"]["validate-labels"]
        self.assertEqual(validation["env"]["EXEMPT_LABEL"], "${{ inputs.exempt-label }}")

    def test_scan_preserves_backfill_cleanup_and_reminder_order(self):
        jobs = self.scan["jobs"]
        self.assertEqual(jobs["label-event-prs"]["needs"], ["configuration", "validate-labels"])
        self.assertIn("no reminders", jobs["label-event-prs"]["name"])
        self.assertEqual(
            jobs["manage-pr-reminders"]["needs"], ["configuration", "validate-labels", "label-event-prs"]
        )
        self.assertEqual(jobs["send-author-reminder"]["needs"], [
            "configuration", "validate-labels", "label-event-prs", "manage-pr-reminders"
        ])
        self.assertEqual(
            jobs["send-author-reminder"]["uses"], "./.github/workflows/reusable-kp-reminder.yml"
        )
        self.assertEqual(
            jobs["manage-pr-reminders"]["env"]["EVENT_LABEL"],
            "${{ needs.configuration.outputs.event-label }}",
        )
        self.assertEqual(
            jobs["manage-pr-reminders"]["env"]["AUTHOR_REMINDER_LABEL"],
            "${{ needs.configuration.outputs.author-reminder-label }}",
        )
        self.assertEqual(
            jobs["manage-pr-reminders"]["env"]["EXEMPT_LABEL"],
            "${{ needs.configuration.outputs.exempt-label }}",
        )
        self.assertEqual(set(self.enroll["jobs"]), {"configuration", "validate-labels", "label-event-prs"})

    def test_private_guards_permissions_and_safe_concurrency(self):
        for filename, workflow in self.workflows.items():
            if filename not in {SCAN, ENROLL} and not filename.startswith("reusable-kp-"):
                continue
            for job in workflow["jobs"].values():
                self.assertIn(f"github.repository == '{PRIVATE_REPO}'", job["if"])
                for step in job.get("steps", []):
                    if step.get("uses", "").startswith("actions/checkout"):
                        self.assertIn(filename, {"reusable-kp-reminder.yml", "reusable-kp-label-event.yml"})
                        self.assertEqual(step["with"]["ref"], "4391f3da665fdf50b6810c1a66712fb9ba21aa93" if step["with"].get("repository") == "actions/stale" else ("${{ steps.trusted-clock-source.outputs.result }}" if filename == "reusable-kp-label-event.yml" else "${{ github.sha }}"))
                        self.assertEqual(step["with"]["persist-credentials"], "false")
        self.assertNotIn("actions", self.enroll["permissions"])
        self.assertEqual(self.enroll["permissions"], {"contents": "read", "issues": "read", "pull-requests": "write"})
        self.assertEqual(self.scan["permissions"]["actions"], "write")
        self.assertEqual(self.scan["concurrency"]["group"], "knowledge-partnership-reminders")
        self.assertEqual(
            self.enroll["concurrency"]["group"],
            "knowledge-partnership-label-pr-${{ github.event.pull_request.number }}",
        )
        for workflow in [self.scan, self.enroll]:
            self.assertEqual(workflow["concurrency"]["cancel-in-progress"], "false")

    def test_business_day_gate_preserves_stock_stale_lifecycle(self):
        reminder = self.workflows["reusable-kp-reminder.yml"]["jobs"]["send-reminders"]
        steps = reminder["steps"]
        actions = [step["with"] for step in steps
                   if (step.get("uses", "").startswith("actions/stale@") or step.get("uses") == "./.kp-stale-action")]
        self.assertEqual(len(actions), 1)
        posting = actions[0]
        self.assertEqual(posting["only-pr-labels"], "${{ env.EVENT_LABEL }}")
        self.assertEqual(posting["any-of-pr-labels"],
                         "${{ format('{0},{1}', env.REMINDER_DUE_LABEL, env.AUTHOR_REMINDER_LABEL) }}")
        self.assertEqual(posting["days-before-pr-stale"], "0")
        for action in actions:
            self.assertEqual(action["remove-pr-stale-when-updated"], "true")
            self.assertEqual(action["days-before-pr-close"], "-1")
            self.assertEqual(action["stale-pr-label"], "${{ env.AUTHOR_REMINDER_LABEL }}")
            self.assertEqual(action["stale-pr-message"], "${{ env.AUTHOR_REMINDER_MESSAGE }}")
            self.assertEqual(action["operations-per-run"], "${{ inputs.operations-per-run }}")
        relevant = [step["name"] for step in steps if step.get("name") in {
            "Reconcile business-day reminder eligibility",
            "Remind authors to address outstanding comments"}]
        self.assertEqual(relevant, [
            "Reconcile business-day reminder eligibility",
            "Remind authors to address outstanding comments"])
        self.assertEqual(self.config["env"]["REMINDER_DUE_LABEL"], "kp-reminder-due")

    def test_private_checkout_has_contents_read_through_reusable_call(self):
        reusable = self.workflows["reusable-kp-reminder.yml"]
        caller_job = self.scan["jobs"]["send-author-reminder"]
        checkout_job = reusable["jobs"]["send-reminders"]
        self.assertEqual(self.scan["permissions"]["contents"], "read")
        self.assertEqual(reusable["permissions"]["contents"], "read")
        for workflow, job in [(self.scan, caller_job), (reusable, checkout_job)]:
            effective = job.get("permissions", workflow["permissions"])
            self.assertEqual(effective.get("contents"), "read")
        self.assertEqual(self.enroll["permissions"]["contents"], "read")

    def test_reusable_input_contracts_and_dependency_graphs_resolve(self):
        for workflow in self.workflows.values():
            remaining = set(workflow["jobs"])
            complete = set()
            while remaining:
                ready = []
                for name in remaining:
                    job = workflow["jobs"][name]
                    needs = job.get("needs", [])
                    if isinstance(needs, str):
                        needs = [needs]
                    self.assertTrue(set(needs) <= set(workflow["jobs"]))
                    if set(needs) <= complete:
                        ready.append(name)
                    if job.get("uses", "").startswith("./.github/workflows/"):
                        target = self.workflows[Path(job["uses"]).name]["on"]["workflow_call"]
                        inputs = target.get("inputs", {})
                        supplied = job.get("with", {})
                        self.assertTrue(set(supplied) <= set(inputs))
                        required = {key for key, value in inputs.items() if value.get("required") == "true"}
                        self.assertTrue(required <= set(supplied))
                self.assertTrue(ready, "Cyclic job dependencies")
                remaining.difference_update(ready)
                complete.update(ready)

    def test_target_changes_reconcile_current_participation_only(self):
        workflow = self.workflows["stale-reconcile-knowledgepartnership.yml"]
        self.assertEqual(workflow["on"], {"pull_request_target": {"types": ["edited"]}})
        self.assertEqual(workflow["permissions"], {key: value for key, value in self.enroll["permissions"].items() if key != "contents"})
        self.assertEqual(workflow["concurrency"], self.enroll["concurrency"])
        configuration = workflow["jobs"]["configuration"]
        self.assertEqual(configuration["uses"], f"./.github/workflows/{CONFIG}")
        self.assertEqual(configuration["permissions"], {})
        reconcile = workflow["jobs"]["reconcile-participation"]
        self.assertEqual(reconcile["needs"], "configuration")
        for job in workflow["jobs"].values():
            self.assertIn(f"github.repository == '{PRIVATE_REPO}'", job["if"])
            for step in job.get("steps", []):
                self.assertNotIn("actions/checkout", step.get("uses", ""))
        for variable, output in [("EVENT_LABEL", "event-label"),
                                 ("ROLLOUT_BRANCH_PREFIX", "rollout-branch-prefix")]:
            self.assertEqual(reconcile["env"][variable],
                             "${{ needs.configuration.outputs." + output + " }}")
        runner = r"""
const assert = require('node:assert/strict');
const {script, condition} = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
const run = new (Object.getPrototypeOf(async function(){}).constructor)(
  'github', 'context', script);
process.env.EVENT_LABEL = 'conference-event';
process.env.ROLLOUT_BRANCH_PREFIX = 'release-ignite26-';
const baseline = {
  number: 42, state: 'open', base: {ref: 'main'},
  labels: [{name: 'conference-event'}, {name: 'kp-author-stalepr'},
    {name: 'kp-author-addresscomments'}, {name: 'kp-stale-exempt'}]
};
// GitHub edited payload: changes.base.ref.from, not changes.base.from.
const targetChange = {base: {ref: {from: 'release-ignite26-test'}, sha: {from: 'oldsha'}}};
for (const repo of ['MicrosoftDocs/azure-docs-pr', 'kp-rollout-negative-fork/azure-docs-pr']) {
  for (const changes of [targetChange, {}, {title: {from: 'Old title'}},
      {body: {from: 'Old body'}}, {base: {sha: {from: 'oldsha'}}}]) {
    // Missing properties in Actions expressions evaluate to an empty value.
    const empty = new Proxy({}, {get: (_, key) =>
      key === Symbol.toPrimitive ? () => '' : empty});
    const wrap = value => new Proxy(value, {
      get: (target, key) => key in target
        ? (typeof target[key] === 'object' ? wrap(target[key]) : target[key])
        : key === Symbol.toPrimitive ? () => '' : empty
    });
    const selected = new Function('github', `return (${condition});`)(
      wrap({repository: repo, event: {changes}}));
    assert.equal(selected, repo === 'MicrosoftDocs/azure-docs-pr' && changes === targetChange);
  }
}
async function check(fresh, expected, failRead = false, failWrite = false) {
  const calls = [];
  const github = {rest: {
    issues: {
      removeLabel: async args => {
        calls.push(['remove', args]);
        if (failWrite) throw new Error('Removal denied');
      }
    },
    pulls: {
      get: async args => {
        calls.push(['get', args]);
        if (failRead) throw new Error('Read denied');
        return {data: fresh};
      }
    }
  }};
  // Deliberately stale event target: decisions must use the current API response.
  const execution = run(github, {repo: {owner: 'MicrosoftDocs', repo: 'azure-docs-pr'},
    payload: {pull_request: {number: 42, base: {ref: 'release-ignite26-test'}}}});
  if (failRead || failWrite) {
    await assert.rejects(execution, failRead ? /Read denied/ : /Removal denied/);
    if (failRead) assert.equal(calls.length, 1);
    return;
  }
  await execution;
  assert.deepEqual(calls.map(([name]) => name), expected ? ['get', 'remove'] : ['get']);
  assert.equal(calls[0][1].pull_number, 42);
  if (expected) {
    assert.deepEqual(calls[1][1], {owner: 'MicrosoftDocs', repo: 'azure-docs-pr',
      issue_number: 42, name: 'conference-event'});
  }
}
(async () => {
  for (const branch of ['main', 'release-other-test', 'release-ignite26-test',
      'release-ignite26-', 'release-ignite26-another']) {
    for (const labeled of [false, true]) {
      for (const state of ['open', 'closed']) {
        await check({...baseline, state, base: {ref: branch},
          labels: labeled ? baseline.labels : baseline.labels.slice(1)},
          state === 'open' && labeled && !branch.startsWith('release-ignite26-'));
      }
    }
  }
  await check({...baseline, draft: true}, true);
  await check(baseline, false, true);
  await check(baseline, false, false, true);
  console.log('Verified target-change routing, fresh participation, no-ops, and errors.');
})().catch(error => {console.error(error); process.exitCode = 1;});
"""
        result = subprocess.run(
            ["node", "-e", runner], input=json.dumps({
                "script": reconcile["steps"][0]["with"]["script"],
                "condition": configuration["if"],
            }),
            text=True, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Verified target-change routing", result.stdout)

    def test_trigger_and_job_routing_matrix(self):
        cases = [
            {"repo": repo, "event": event, "action": action, "branch": branch, "labelsOnly": labels}
            for repo, (event, action), branch, labels in itertools.product(
                [PRIVATE_REPO, "MicrosoftDocs/azure-docs", "kp-rollout-negative-fork/azure-docs-pr"],
                [("schedule", ""), ("workflow_dispatch", "")]
                + [("pull_request_target", action) for action in
                   ["opened", "reopened", "ready_for_review", "edited", "synchronize", "closed"]],
                ["main", "release-ignite26-test", "release-ignite26-", "release-other-test"],
                [False, True],
            )
        ]
        runner = r"""
const {workflows, cases} = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
for (const c of cases) {
  const github = {repository:c.repo, event_name:c.event,
    event:{pull_request:{number:42, base:{ref:c.branch}}}};
  const inputs = {'labels-only':c.labelsOnly};
  const needs = {configuration:{outputs:{'rollout-branch-prefix':'release-ignite26-'}}};
  const evaluate = expression => new Function('github','inputs','needs','startsWith',
    `return (${expression.replace(/inputs\.labels-only/g, "inputs['labels-only']")
      .replace(/outputs\.rollout-branch-prefix/g, "outputs['rollout-branch-prefix']")});`
  )(github,inputs,needs,(text,prefix)=>text.toLowerCase().startsWith(prefix.toLowerCase()));
  for (const [name, workflow] of Object.entries(workflows)) {
    const trigger = workflow.on[c.event];
    const triggered = trigger !== undefined &&
      (c.event !== 'pull_request_target' || trigger.types.includes(c.action));
    const selected = new Set();
    if (triggered) {
      for (const [id, job] of Object.entries(workflow.jobs)) {
        const deps = typeof job.needs === 'string' ? [job.needs] : (job.needs ?? []);
        if (deps.every(dep=>selected.has(dep)) && evaluate(job.if)) selected.add(id);
      }
    }
    const privateRepo = c.repo === 'MicrosoftDocs/azure-docs-pr';
    const enrollment = name === 'enroll';
    const shouldTrigger = enrollment
      ? c.event === 'pull_request_target' && c.action !== 'closed'
      : ['schedule','workflow_dispatch'].includes(c.event);
    const shouldLabel = privateRepo && shouldTrigger &&
      (!enrollment || c.branch.startsWith('release-ignite26-'));
    const shouldRemind = !enrollment && privateRepo && shouldTrigger && !c.labelsOnly;
    if (selected.has('configuration') !== (privateRepo && shouldTrigger) ||
        selected.has('label-event-prs') !== shouldLabel ||
        selected.has('send-author-reminder') !== shouldRemind ||
        (enrollment && selected.has('manage-pr-reminders'))) {
      throw new Error(JSON.stringify({name,c,selected:[...selected]}));
    }
    if (triggered) {
      const runName = workflow['run-name'].replace(/\$\{\{([\s\S]*?)\}\}/g, (_,expression)=>evaluate(expression));
      if (enrollment && !runName.includes('no reminders')) throw new Error(runName);
      if (!enrollment && c.labelsOnly && c.event === 'workflow_dispatch' &&
          !runName.includes('no reminders')) throw new Error(runName);
    }
  }
}
console.log(`Verified ${cases.length * 2} entry-point routing cases.`);
"""
        result = subprocess.run(
            ["node", "-e", runner],
            input=json.dumps({"workflows": {"scan": self.scan, "enroll": self.enroll}, "cases": cases}),
            text=True, capture_output=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Verified 384 entry-point routing cases.", result.stdout)

    def test_general_stale_excludes_kp_preserving_policy(self):
        expected = [{'workflow': 'stale.yml',
          'job': 'stale',
          'step': 0,
          'uses': 'actions/stale@4391f3da665fdf50b6810c1a66712fb9ba21aa93',
          'settings': {'repo-token': '${{ secrets.GITHUB_TOKEN }}',
                       'days-before-pr-stale': '14',
                       'days-before-pr-close': '90',
                       'stale-pr-label': 'inactive',
                       'close-pr-label': 'auto-close',
                       'exempt-pr-labels': 'keep-open,conference-event',
                       'operations-per-run': '1300',
                       'ascending': 'false',
                       'stale-pr-message': 'This pull request has been inactive for at least '
                                           '14 days.\n'
                                           "If you are finished with your changes, don't "
                                           'forget to sign off. See the [platform '
                                           'guide](https://learn.microsoft.com/help/platform/prmerger-hashtag-commands) '
                                           '(sign-in required) for instructions.\n'
                                           ' \n'
                                           '[Get '
                                           'Help](https://learn.microsoft.com/help/platform/help-options)  '
                                           '(sign-in required) | [Learn Support Teams '
                                           'Channel](https://teams.microsoft.com/l/channel/19%3a7ecffca1166a4a3986fed528cf0870ee%40thread.skype/General?groupId=de9ddba4-2574-4830-87ed-41668c07a1ca&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47)   '
                                           '| [Resolve Merge '
                                           'Conflicts](https://learn.microsoft.com/help/contribute/resolve-merge-conflicts) '
                                           '(sign-in required)\n',
                       'close-pr-message': 'This pull request has been inactive for 90 days, '
                                           'and an `auto-close` label has been added. At this '
                                           'time, the system is closing the PR automatically. '
                                           'If you decide to continue working on your changes, '
                                           'scroll to the bottom of the pull request comments '
                                           'and select the **Reopen pull request** button. '
                                           '<br/>\n'}}]
        actual = []
        for filename, workflow in sorted(self.workflows.items()):
            if filename.startswith(('reusable-kp-', 'stale-enroll-knowledgepartnership',
                                    'stale-comment-knowledgepartnership', 'stale-reconcile-knowledgepartnership')):
                continue
            for job_name, job in sorted(workflow['jobs'].items()):
                for index, step in enumerate(job.get('steps', [])):
                    if str(step.get('uses', '')).startswith('actions/stale@'):
                        actual.append({'workflow': filename, 'job': job_name, 'step': index,
                                       'uses': step['uses'], 'settings': step.get('with', {})})
        self.assertEqual(actual, expected)
        for invocation in actual:
            self.assertIn('conference-event', invocation['settings']['exempt-pr-labels'].split(','))

    def test_review_fixes_recover_membership_and_isolate_stock_cache(self):
        workflows = self.workflows
        membership = workflows["reusable-kp-label-event.yml"]["jobs"]["label-event-prs"]["steps"][-1]
        self.assertIn("actions/github-script@", membership["uses"])
        reminder = workflows["reusable-kp-reminder.yml"]["jobs"]["send-reminders"]["steps"]
        checkout = next(step for step in reminder if step.get("with", {}).get("repository") == "actions/stale")
        self.assertEqual(checkout["with"]["ref"], "4391f3da665fdf50b6810c1a66712fb9ba21aa93")
        self.assertEqual(checkout["with"]["path"], ".kp-stale-action")
        self.assertEqual(checkout["with"]["persist-credentials"], "false")
        self.assertIn("/package.json", checkout["with"]["sparse-checkout"])
        isolation = next(step for step in reminder if step.get("name") == "Isolate KP reminder progress")
        posting = next(step for step in reminder if step.get("uses") == "./.kp-stale-action")
        self.assertLess(reminder.index(checkout), reminder.index(isolation))
        self.assertLess(reminder.index(isolation), reminder.index(posting))
        self.assertEqual(posting["with"]["days-before-pr-close"], "-1")
        runner = r"""
const assert = require('node:assert/strict');
const vm = require('node:vm');
const input = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
const executeMembership = new (Object.getPrototypeOf(async function(){}).constructor)(
  'github', 'context', 'core', 'require', input.membership);
const action = (github, context) => executeMembership(github, context, {info() {}},
  () => ({initialize: async () => {}}));
process.env.EVENT_LABEL = 'conference-event';
process.env.ROLLOUT_BRANCH_PREFIX = 'release-ignite26-';
process.env.EVENT_NAME = 'schedule';
async function check(pr, expected, failure) {
  const writes = [], reads = [];
  const github = {rest: {pulls: {
    list() {},
    get: async args => {reads.push(args); if (failure === 'read') throw Error('Read failed'); return {data: pr};}
  }, issues: {
    addLabels: async args => {if (failure === 'write') throw Error('Write failed'); writes.push(['add', args]);},
    removeLabel: async args => {if (failure === 'write') throw Error('Write failed'); writes.push(['remove', args]);}
  }}, paginate: {iterator: async function* () {
    yield {data: []};
    yield {data: [{number: 42, base: {ref: 'stale-event-target'}}]};
  }}};
  const promise = action(github, {repo: {owner: 'owner', repo: 'private'}});
  if (failure) {await assert.rejects(promise, failure === 'read' ? /Read failed/ : /Write failed/); return;}
  await promise;
  assert.equal(reads.length, 1);
  assert.equal(reads[0].pull_number, 42);
  assert.deepEqual(writes.map(item => item[0]), expected ? [expected] : []);
  if (expected) assert.equal(writes[0][1].issue_number, 42);
  if (expected === 'remove') assert.equal(writes[0][1].name, 'conference-event');
  if (expected === 'add') assert.deepEqual(writes[0][1].labels, ['conference-event']);
}
(async () => {
  for (const state of ['open', 'closed']) for (const member of [false, true])
    for (const eligible of [false, true]) {
      const pr = {number: 42, state, base: {ref: eligible ? 'release-ignite26-test' : 'main'},
        labels: member ? [{name: 'conference-event'}, {name: 'keep-open'}] : [{name: 'keep-open'}]};
      await check(pr, state !== 'open' ? null : eligible && !member ? 'add' : !eligible && member ? 'remove' : null);
    }
  const pr = {number: 42, state: 'open', base: {ref: 'main'}, labels: [{name: 'conference-event'}]};
  await check(pr, null, 'read');
  await check(pr, null, 'write');
  for (const mode of ['already-absent', 'still-present', 'read-failed', 'forbidden', 'server-error']) {
    let reread = false;
    const visited = [];
    const removalError = Object.assign(new Error('Removal failed'), {
      status: mode === 'forbidden' ? 403 : mode === 'server-error' ? 500 : 404
    });
    const github = {rest: {pulls: {
      list() {},
      get: async ({pull_number}) => {
        visited.push(pull_number);
        if (pull_number === 43) return {data: {...pr, number: 43, labels: []}};
        if (reread && mode === 'read-failed') throw new Error('Reread failed');
        return {data: {...pr, labels: reread && mode === 'already-absent' ? [] : pr.labels}};
      }
    }, issues: {
      removeLabel: async () => {reread = true; throw removalError;},
      addLabels: async () => {throw new Error('Unexpected enrollment');}
    }}, paginate: {iterator: async function* () {
      yield {data: [{number: 42}, {number: 43}]};
    }}};
    const promise = action(github, {repo: {owner: 'owner', repo: 'private'}});
    if (mode === 'already-absent') {
      await promise;
      assert.deepEqual(visited, [42, 42, 43]);
    } else {
      await assert.rejects(promise, mode === 'read-failed' ? /Reread failed/ : /Removal failed/);
      assert.deepEqual(visited, mode === 'forbidden' || mode === 'server-error' ? [42] : [42, 42]);
    }
  }
  const script = input.isolation.split("\n").slice(1, -2).join("\n") + "\n";
  const anchor = "async _markStale(issue, staleMessage, staleLabel, skipMessage) {\n        const issueLogger = new IssueLogger(issue);";
  const original = "const CACHE_KEY = '_state';\n" + anchor;
  function isolate(tamper = false, content = original) {
    let result;
    const mockFs = {
      readFileSync(file, encoding) {
        const text = file.endsWith('action.yml') ? 'manifest' : file.endsWith('package.json') ? 'package' : content;
        return encoding ? text : Buffer.from(text);
      },
      writeFileSync(file, text) {assert.equal(file, '.kp-stale-action/dist/index.js'); result = text;}
    };
    const hashes = {
      manifest: '42c2129639c5e66ee659a85f3ab6bc67a05f46f1691f9fc1d2575035e30d06f4',
      package: 'f97133fb86d6112b7f32ce81089227eff4b89a79a8b8942b2e8d12dc91975e25',
      [content]: 'b82d1121447dd601777e30e806db7d052bffddc35ef33bd3695fa10a3ddec34b'
    };
    vm.runInNewContext(script, {require: name => name === 'node:fs' ? mockFs : {
      createHash: () => ({update: data => ({digest: () => tamper ? 'wrong' : hashes[data.toString()]})})
    }});
    return result;
  }
  const patched = isolate();
  const guard = patched.slice(patched.indexOf(anchor) + anchor.length);
  assert.equal(patched.slice(0, -guard.length), original.replace("'_state'", "'kp-author-reminders-v1'"));
  assert.match(guard, /canPost/);
  const beforePost = new (Object.getPrototypeOf(async function(){}).constructor)(
    'issue', 'issueLogger', '__WEBPACK_EXTERNAL_createRequire', 'process', 'github_context',
    guard.replace('import.meta.url', '"file:///fixture.js"') + '\nreturn "post";');
  for (const result of [true, false, 'error']) {
    const client = {}, context = {repo: {owner: 'owner', repo: 'private'}};
    const fakeProcess = {env: {GITHUB_WORKSPACE: '/trusted'}};
    let calls = 0;
    const load = name => name === 'node:path' ? require('node:path') : {
      canPost: async args => {
        calls++;
        assert.equal(args.github, client); assert.equal(args.context, context); assert.equal(args.number, 42);
        if (result === 'error') throw Error('Read failed');
        return result;
      }
    };
    const promise = beforePost.call({client}, {number: 42}, {info() {}}, () => load, fakeProcess, context);
    if (result === 'error') {
      await assert.rejects(promise, /Read failed/);
      assert.equal(fakeProcess.exitCode, 1);
    } else assert.equal(await promise, result ? 'post' : undefined);
    assert.equal(calls, 1);
  }
  assert.throws(() => isolate(true), /Unexpected pinned stale content/);
  assert.throws(() => isolate(false, original + original), /cache-key contract/);
  assert.throws(() => isolate(false, 'no key'), /cache-key contract/);
  assert.throws(() => isolate(false, original.replace(anchor, 'no posting method')), /posting contract/);
  console.log('Verified review fixes with mocks');
})().catch(error => {console.error(error); process.exitCode = 1;});
"""
        result = subprocess.run(["node", "-e", runner], text=True, capture_output=True,
                                input=json.dumps({"membership": membership["with"]["script"],
                                                  "isolation": isolation["run"]}))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Verified review fixes with mocks", result.stdout)

    def test_due_validation_and_prelabel_clock_are_wired_before_enrollment(self):
        validator = self.workflows["reusable-kp-validate-labels.yml"]
        self.assertEqual(validator["on"]["workflow_call"]["inputs"]["reminder-due-label"]["required"], "true")
        job = validator["jobs"]["validate-labels"]
        self.assertEqual(job["env"]["REMINDER_DUE_LABEL"], "${{ inputs.reminder-due-label }}")
        self.assertIn('"$REMINDER_DUE_LABEL"', job["steps"][0]["run"])
        for caller in [self.scan, self.enroll]:
            self.assertEqual(caller["jobs"]["validate-labels"]["with"]["reminder-due-label"],
                             "${{ needs.configuration.outputs.reminder-due-label }}")
            self.assertIn("validate-labels", caller["jobs"]["label-event-prs"]["needs"])
            for key in ["reminder-due-label", "author-reminder-label"]:
                self.assertEqual(caller["jobs"]["label-event-prs"]["with"][key],
                                 "${{ needs.configuration.outputs." + key + " }}")
        membership = self.workflows["reusable-kp-label-event.yml"]
        self.assertEqual(membership["permissions"]["contents"], "read")
        self.assertEqual(membership["jobs"]["label-event-prs"]["concurrency"],
                         {"group": "knowledge-partnership-membership-${{ github.event_name == 'pull_request_target' && 'enrollment' || 'scan' }}", "cancel-in-progress": "false"})
        steps = membership["jobs"]["label-event-prs"]["steps"]
        self.assertIn("github.rest.repos.getBranch", steps[0]["with"]["script"])
        self.assertEqual(steps[1]["with"]["ref"], "${{ steps.trusted-clock-source.outputs.result }}")
        script = steps[-1]["with"]["script"]
        self.assertLess(script.index("await initialize("), script.index("await github.rest.issues.addLabels("))


if __name__ == "__main__":
    unittest.main()

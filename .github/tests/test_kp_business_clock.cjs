const test = require('node:test');
const assert = require('node:assert/strict');
const {isDue, reconcile, readClock, canPost: postingGate, PREFIX} = require('../scripts/kp-business-clock.cjs');

async function canPost(args) {
  if (typeof args.now === 'number' && args.github.advanceTo) {
    args.github.advanceTo(args.now);
    return postingGate({...args, now: args.github.time});
  }
  return postingGate(args);
}

test('72 elapsed Redmond weekday hours, not office hours or calendar-date counting', () => {
  const due = (start, end) => isDue(start, Date.parse(end), 3);
  // Friday noon PDT -> Wednesday noon PDT; the entire weekend is excluded.
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-26T19:00:00Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T18:59:59Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T19:00:00Z'), true);
  // UTC Saturday is still Friday evening in Redmond.
  assert.equal(due('2026-10-24T06:00:00Z', '2026-10-29T06:00:00Z'), true);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T06:59:59Z'), false);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T07:00:00Z'), true);
  // DST changes on the excluded Sunday: local deadline remains Wednesday noon.
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T18:59:59Z'), false);
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T19:00:00Z'), true);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T19:59:59Z'), false);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T20:00:00Z'), true);
  assert.equal(due('2026-10-28T19:00:00Z', '2026-10-27T19:00:00Z'), false);
  assert.throws(() => due('invalid', '2026-10-28T19:00:00Z'), /Invalid/);
  assert.throws(() => isDue('2026-10-23T19:00:00Z', Date.now(), -1), /Invalid/);
});

function fixture() {
  Object.assign(process.env, {
    EVENT_LABEL: 'kp-conference-event', REMINDER_DUE_LABEL: 'kp-reminder-due',
    AUTHOR_REMINDER_LABEL: 'kp-author-stalepr', EXEMPT_LABEL: 'keep-open',
    AUTHOR_REMINDER_MESSAGE: 'Existing author reminder', INACTIVITY_DAYS: '3',
    ROLLOUT_BRANCH_PREFIX: 'release-ignite26-'
  });
  let now = Date.parse('2026-10-26T19:00:00Z');
  const comments = [], events = [], reviews = [], writes = [];
  const pr = {number: 42, user: {login: 'pr-author', type: 'User'}, state: 'open', draft: false, title: 'Title', body: 'Body',
    head: {sha: 'abc'}, base: {ref: 'release-ignite26-test'},
    created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z', labels: [{name: 'kp-conference-event'}],
    assignees: [], requested_reviewers: [], requested_teams: []};
  let issueCount, reviewCount;
  Object.defineProperties(pr, {
    comments: {enumerable: true, get: () => issueCount ?? comments.length, set: value => {issueCount = value;}},
    review_comments: {enumerable: true, get: () => reviewCount ?? reviews.length, set: value => {reviewCount = value;}}
  });
  const stamp = () => new Date(now += 1000).toISOString();
  function label(name, add) {
    pr.labels = pr.labels.filter(item => item.name !== name);
    if (add) pr.labels.push({name});
    pr.updated_at = stamp();
    events.push({event: add ? 'labeled' : 'unlabeled', label: {name},
      actor: {login: 'github-actions[bot]', type: 'Bot'}, created_at: pr.updated_at});
    writes.push([add ? 'add' : 'remove', name]);
  }
  const get = async () => ({data: structuredClone(pr)});
  const endpoints = {
    list: () => {}, get,
    listComments: () => {}, listEventsForTimeline: () => {}, listReviewComments: () => {},
    getLabel: async () => ({data: {name: 'kp-reminder-due'}}),
    createComment: async ({body}) => {
      const comment = {id: comments.length + 1, body, user: {login: 'github-actions[bot]', type: 'Bot'},
        created_at: stamp()};
      comment.updated_at = comment.created_at;
      comments.push(comment); pr.updated_at = comment.updated_at;
      writes.push(['comment', body]);
      return {data: structuredClone(comment)};
    },
    updateComment: async ({comment_id, body}) => {
      const comment = comments.find(item => item.id === comment_id);
      comment.body = body; comment.updated_at = stamp(); pr.updated_at = comment.updated_at;
      writes.push(['update', body]);
      return {data: structuredClone(comment)};
    },
    addLabels: async ({labels}) => {for (const name of labels) label(name, true);},
    removeLabel: async ({name}) => label(name, false)
  };
  const paginate = async endpoint => structuredClone(
    endpoint === endpoints.listComments ? comments : endpoint === endpoints.listReviewComments ? reviews : events);
  paginate.iterator = async function* () {yield {data: [structuredClone(pr)]};};
  const github = {time: () => now, advanceTo: value => {now = Math.max(now, value);},
    graphql: async (query, params) => {
    assert.ok(query.includes('lastEditedAt'));
    assert.equal(params.owner, 'test');
    assert.equal(params.repo, 'repo');
    assert.equal(params.number, 42);
    return {repository: {pullRequest: {lastEditedAt: pr.lastEditedAt ?? null,
      editor: pr.editor ?? {login: 'pr-author', __typename: 'User'},
      reviews: {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}}}}};
  }, rest: {pulls: {list: endpoints.list, get, listReviewComments: endpoints.listReviewComments},
    issues: endpoints}, paginate};
  const run = () => reconcile({github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, now: () => now});
  return {pr, comments, events, reviews, writes, github, run, label,
    time: () => now,
    setTime: value => {now = Date.parse(value);},
    humanComment: () => {
      pr.updated_at = stamp();
      comments.push({id: comments.length + 1, body: 'Author activity',
        user: {login: 'author', type: 'User'}, created_at: pr.updated_at, updated_at: pr.updated_at});
    }};
}

test('initial clock creation needs one comment write and no identical follow-up PATCH', async () => {
  const f = fixture();
  await f.run();
  assert.equal(f.writes.filter(([kind]) => kind === 'comment').length, 1);
  assert.equal(f.writes.filter(([kind]) => kind === 'update').length, 0);
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
});

test('Learn build bots are ignored across issue, inline, summary and timeline feedback without resetting markers', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const login of ['learn-build-service-prod', 'LEARN-BUILD-SERVICE-PROD-05[bot]',
    'copilot-pull-request-reviewer[bot]', 'validation-service']) {
    for (const kind of ['issue', 'inline', 'summary', 'timeline']) {
      const f = fixture();
      await f.run();
      const activityAt = readClock(f.comments[0]).activityAt;
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      f.label('kp-author-stalepr', true);
      const at = '2026-10-28T19:02:00Z';
      const user = {login, type: 'Bot', __typename: 'Bot'};
      const report = {id: 900, body: 'Learn scan report', user, created_at: at, updated_at: at};
      if (kind === 'issue') f.comments.push(report);
      if (kind === 'inline') {
        f.reviews.push(report);
        f.events.push({event: 'line-commented', comments: [structuredClone(report)]});
      }
      if (kind === 'timeline') f.events.push({event: 'build_report_uploaded', actor: user, created_at: at});
      if (kind === 'summary') {
        const graphql = f.github.graphql;
        f.github.graphql = async (...args) => {
          assert.ok(args[0].includes('author { login __typename }'));
          const result = await graphql(...args);
          result.repository.pullRequest.reviews.nodes.push({
            submittedAt: at, lastEditedAt: '2026-10-28T19:02:01Z', author: user, editor: user});
          return result;
        };
      }
      f.pr.updated_at = at;
      f.setTime('2026-10-28T19:03:00Z');
      await f.run();
      assert.equal(readClock(f.comments[0]).activityAt, activityAt, `${kind}/${login}`);
      assert.deepEqual(readClock(f.comments[0]).commentIds, {issue: [], review: []});
      const writes = f.writes.length;
      assert.equal(await hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, since: '2026-10-28T19:01:00Z', now: f.github.time}), false);
      assert.equal(f.writes.length, writes);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
      report.body = 'Edited Learn scan report';
      report.updated_at = '2026-10-28T19:03:10Z';
      f.pr.updated_at = report.updated_at;
      f.setTime('2026-10-28T19:04:00Z');
      await f.run();
      assert.equal(readClock(f.comments[0]).activityAt, activityAt);
      f.humanComment();
      const humanAt = f.pr.updated_at;
      await f.run();
      assert.equal(readClock(f.comments[0]).activityAt, humanAt);
    }
  }
});

test('all actual Bot accounts are excluded by authenticated type, never by login spelling or body text', async () => {
  for (const user of [
    {login: 'not-learn-build-service-prod', type: 'Bot'},
    {login: 'learn-build-service', type: 'Bot'},
    {login: 'learn-build-service-prod', type: 'User'},
    {login: 'unrelated-check[bot]', type: 'Bot'},
    {login: 'human-reviewer', type: 'User'}
  ]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    f.comments.push({id: 900, body: 'learn-build-service-prod: PoliCheck Scan Report', user,
      created_at: '2026-10-28T19:00:00Z', updated_at: '2026-10-28T19:00:00Z'});
    f.pr.updated_at = '2026-10-28T19:00:00Z';
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt,
      user.type === 'Bot' ? '2026-10-23T19:00:00Z' : '2026-10-28T19:00:00Z', user.login);
    assert.deepEqual(readClock(f.comments[0]).commentIds.issue, user.type === 'Bot' ? [] : [900]);
  }
});

test('ignored Learn reports cannot time ambiguous metadata, seed an invented enrollment baseline or bypass raw counts', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const problem of ['head', 'title', 'counts', 'identity', 'missing-user', 'contradictory-type',
    'time', 'future', 'enrollment']) {
    const f = fixture();
    if (problem !== 'enrollment') await f.run();
    const before = f.comments[0]?.body;
    const at = '2026-10-28T19:00:00Z';
    const report = {id: 900, body: 'Learn scan report',
      user: {login: 'learn-build-service-prod', type: 'Bot'}, created_at: at, updated_at: at};
    f.comments.push(report);
    f.pr.updated_at = at;
    if (problem === 'head') f.pr.head.sha = 'untimed-new-head';
    if (problem === 'title') f.pr.title = 'Untimed rename';
    if (problem === 'counts') f.pr.comments += 1;
    if (problem === 'identity') delete report.user.type;
    if (problem === 'missing-user') report.user = null;
    if (problem === 'contradictory-type') report.user.__typename = 'User';
    if (problem === 'time') report.updated_at = 'invalid';
    if (problem === 'future') report.updated_at = '2026-10-30T00:00:00Z';
    f.setTime('2026-10-28T19:01:00Z');
    const writes = f.writes.length;
    if (problem === 'enrollment') {
      assert.equal(await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
        managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.github.time}), 'skipped');
    } else {
      await f.run();
      assert.equal(f.comments[0].body, before, problem);
    }
    assert.equal(f.writes.length, writes, problem);
  }
});

test('Learn bot PR/review edits are attributed through server editor identity while human review edits still count', async () => {
  for (const target of ['pr', 'review']) {
    for (const bot of [true, false]) {
      const f = fixture();
      await f.run();
      const activityAt = readClock(f.comments[0]).activityAt;
      const graphql = f.github.graphql;
      const at = '2026-10-28T19:00:00Z';
      const editor = bot ? {login: 'learn-build-service-prod-05', __typename: 'Bot'}
        : {login: 'reviewer', __typename: 'User'};
      f.github.graphql = async (...args) => {
        assert.ok(args[0].includes('editor { login __typename }'));
        const result = await graphql(...args);
        const record = result.repository.pullRequest;
        if (target === 'pr') Object.assign(record, {lastEditedAt: at, editor});
        else record.reviews.nodes.push({submittedAt: activityAt, lastEditedAt: at,
          author: {login: 'reviewer', __typename: 'User'}, editor});
        return result;
      };
      f.pr.updated_at = at;
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      assert.equal(readClock(f.comments[0]).activityAt, bot ? activityAt : at);
    }
  }
});

test('missing summary author/editor and malformed ignored feedback stay uncertain, while genuine API errors stay fatal', async () => {
  for (const problem of ['author', 'editor', 'id', 'denied']) {
    const f = fixture();
    await f.run();
    const before = f.comments[0].body;
    const graphql = f.github.graphql;
    f.github.graphql = async (...args) => {
      if (problem === 'denied') throw Error('Summary author read denied');
      const result = await graphql(...args);
      result.repository.pullRequest.reviews.nodes.push({
        submittedAt: '2026-10-23T19:00:00Z',
        lastEditedAt: problem === 'editor' ? '2026-10-28T19:00:00Z' : null,
        author: problem === 'author' ? null : {login: 'human', __typename: 'User'}, editor: null
      });
      return result;
    };
    if (problem === 'id') f.reviews.push({id: 0, body: 'Report',
      user: {login: 'learn-build-service-prod', type: 'Bot'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    f.setTime('2026-10-28T19:01:00Z');
    const writes = f.writes.length;
    if (problem === 'denied' || problem === 'id') {
      await assert.rejects(f.run(), /Summary author read denied|Invalid persisted KP comment identities/);
    } else await f.run();
    assert.equal(f.writes.length, writes);
    assert.equal(f.comments[0].body, before);
  }
});

test('known present legacy Learn identities normalize without a deletion reset and bot-only wrapper edits cannot reenter feedback guards', async () => {
  for (const kind of ['issue', 'inline']) {
    const f = fixture();
    await f.run();
    const clock = readClock(f.comments[0]);
    const report = {id: 900, body: 'Old build report',
      user: {login: 'learn-build-service-prod-05', type: 'Bot'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-28T19:00:00Z'};
    (kind === 'issue' ? f.comments : f.reviews).push(report);
    if (kind === 'inline') {
      const nested = structuredClone(report);
      nested.body = 'Earlier build report revision';
      nested.updated_at = nested.created_at;
      f.events.push({event: 'line-commented', comments: [nested]});
    }
    clock.commentIds[kind === 'issue' ? 'issue' : 'review'] = [900];
    f.comments[0].body = PREFIX + JSON.stringify(clock) + '\n-->\nLegacy visible wording';
    f.pr.updated_at = report.updated_at;
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, clock.activityAt);
    assert.deepEqual(readClock(f.comments[0]).commentIds, {issue: [], review: []});
    if (kind === 'inline') {
      f.reviews.splice(0, 1);
      f.setTime('2026-10-28T19:02:00Z');
      await f.run();
      assert.equal(readClock(f.comments[0]).activityAt, clock.activityAt,
        'a retained authenticated bot-only wrapper must not resurrect deleted bot feedback');
      const before = f.comments[0].body;
      const writes = f.writes.length;
      f.events[0].comments[0].user = {login: 'human', type: 'User'};
      await f.run();
      assert.equal(f.writes.length, writes, 'a contradictory human wrapper must not be hidden');
      assert.equal(f.comments[0].body, before);
    }
  }
});

test('edited timeline reports obscure fallback time without hiding independently timed genuine activity', async () => {
  for (const genuine of [false, true]) {
    const f = fixture();
    await f.run();
    const before = f.comments[0].body;
    f.pr.head.sha = 'changed-head';
    f.pr.updated_at = '2026-10-28T19:02:00Z';
    f.events.push({event: 'build_report_uploaded',
      actor: {login: 'learn-build-service-prod', type: 'Bot'},
      created_at: '2026-10-23T19:00:00Z', edited_at: f.pr.updated_at});
    f.setTime('2026-10-28T19:03:00Z');
    if (genuine) f.humanComment();
    await f.run();
    if (genuine) assert.equal(readClock(f.comments[0]).activityAt, f.comments.at(-1).created_at);
    else assert.equal(f.comments[0].body, before);
  }
});

test('policy provenance migrates only fully attributed legacy identities without rolling back activity', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    const author = {login: 'human', type: 'User'};
    entries.push({id: 500, body: 'Human feedback', user: author,
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await f.run();
    const comment = f.comments.find(item => item.body.startsWith(PREFIX));
    const legacy = readClock(comment);
    delete legacy.feedbackPolicy;
    delete legacy.confirmedDeletedReviewIds;
    comment.body = PREFIX + JSON.stringify(legacy) + '\n-->\nLegacy clock';
    const beforeActivity = legacy.activityAt;
    f.setTime('2026-10-27T19:00:00Z');
    await f.run();
    assert.equal(readClock(comment).feedbackPolicy, 'github-bot-excluded-v1');
    assert.equal(readClock(comment).activityAt, beforeActivity);
    assert.deepEqual(readClock(comment).commentIds[kind], [500]);
    entries.push({id: 900, body: 'Bot report', user: {login: 'any-checker', type: 'Bot'},
      created_at: '2026-10-27T19:01:00Z', updated_at: '2026-10-27T19:01:00Z'});
    f.pr.updated_at = '2026-10-27T19:01:00Z';
    f.setTime('2026-10-27T19:02:00Z');
    await f.run();
    entries.splice(entries.findIndex(item => item.id === 900), 1);
    f.pr.updated_at = '2026-10-27T19:03:00Z';
    f.setTime('2026-10-27T19:04:00Z');
    await f.run();
    assert.equal(readClock(comment).activityAt, beforeActivity, 'ignored bot deletion is not human deletion');
    entries.splice(entries.findIndex(item => item.id === 500), 1);
    f.setTime('2026-10-27T19:05:00Z');
    await f.run();
    assert.equal(readClock(comment).activityAt, '2026-10-27T19:05:00.000Z');
    assert.deepEqual(readClock(comment).commentIds[kind], []);
  }
});

test('missing legacy authors stay uncertain and cannot be dropped or stamped with the new policy', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    await f.run();
    const comment = f.comments[0], legacy = readClock(comment);
    delete legacy.feedbackPolicy;
    delete legacy.confirmedDeletedReviewIds;
    legacy.commentIds[kind] = [500];
    comment.body = PREFIX + JSON.stringify(legacy) + '\n-->\nLegacy clock';
    const before = comment.body, writes = f.writes.length;
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(await hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, since: '2026-10-20T00:00:00Z', now: f.github.time}), null);
    assert.equal(comment.body, before);
    assert.equal(f.writes.length, writes);
    assert.equal(readClock(comment).feedbackPolicy, undefined);
  }
});

test('unknown or inconsistent policy provenance is a fatal persisted-state error', async () => {
  for (const change of [{feedbackPolicy: 'future-policy'}, {feedbackPolicy: null},
    {feedbackPolicy: 'github-bot-excluded-v1', commentIds: undefined}]) {
    const f = fixture();
    await f.run();
    f.comments[0].body = PREFIX + JSON.stringify({...readClock(f.comments[0]), ...change}) + '\n-->';
    const writes = f.writes.length;
    await assert.rejects(f.run(), /Invalid persisted KP feedback policy/);
    assert.equal(f.writes.length, writes);
  }
});

test('checks and statuses are not activity sources, and App-assisted human feedback is not a Bot account', async () => {
  const f = fixture();
  await f.run();
  const baseline = readClock(f.comments[0]).activityAt;
  f.github.rest.checks = {listForRef: () => {throw Error('Checks must not be ingested');}};
  f.github.rest.repos = {getCombinedStatusForRef: () => {throw Error('Statuses must not be ingested');}};
  f.pr.updated_at = '2026-10-27T19:00:00Z';
  f.setTime('2026-10-27T20:00:00Z');
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, baseline);
  f.comments.push({id: 900, body: 'Human feedback routed through an app',
    user: {login: 'human', type: 'User'}, performed_via_github_app: {slug: 'review-service'},
    created_at: '2026-10-27T20:00:00Z', updated_at: '2026-10-27T20:00:00Z'});
  f.pr.updated_at = '2026-10-27T20:00:00Z';
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T20:00:00Z');
  const before = f.comments[0].body, writes = f.writes.length;
  f.events.push({event: 'unclassified_check_family_event', actor: {login: 'human', type: 'User'},
    created_at: '2026-10-27T20:00:00Z'});
  await f.run();
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
});

test('posting rejects an empty message before API reads or writes', async () => {
  const f = fixture();
  process.env.AUTHOR_REMINDER_MESSAGE = '';
  f.github.rest.pulls.get = async () => {throw new Error('Unexpected API read');};
  await assert.rejects(canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.github.time}), /Invalid KP business clock settings/);
  assert.deepEqual(f.writes, []);
});

test('mentioned and historical bot reminders retain bookkeeping without deliberate reposting', async () => {
  for (const mentioned of [false, true]) {
    const f = fixture();
    await f.run();
    const activityAt = readClock(f.comments[0]).activityAt;
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const body = (mentioned ? '@pr-author\n\n' : '') + process.env.AUTHOR_REMINDER_MESSAGE;
    await f.github.rest.issues.createComment({body});
    f.label('kp-author-stalepr', true);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), false);
    const identities = readClock(f.comments[0]).commentIds;
    assert.deepEqual(identities.issue, []);
    f.comments.splice(f.comments.findIndex(comment => comment.body === body), 1);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
  }
});

test('a human copy of the mentioned reminder remains genuine feedback activity', async () => {
  const f = fixture();
  await f.run();
  const observed = '2026-10-28T19:01:00Z';
  f.setTime(observed);
  f.pr.updated_at = observed;
  f.comments.push({id: 900, user: {login: 'pr-author', type: 'User'},
    body: `@pr-author\n\n${process.env.AUTHOR_REMINDER_MESSAGE}`,
    created_at: observed, updated_at: observed});
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, observed);
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
});

test('only the configured KP membership label enrolls reconciliation and posting', async () => {
  const legacy = fixture();
  legacy.pr.labels = [{name: 'conference-event'}];
  await legacy.run();
  assert.deepEqual(legacy.writes, []);
  await assert.rejects(canPost({github: legacy.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), /Expected one KP clock/);

  const current = fixture();
  await current.run();
  assert.ok(current.comments.some(comment => comment.body.startsWith(PREFIX)));
  current.setTime('2026-10-28T19:01:00Z');
  await current.run();
  assert.ok(current.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.equal(await canPost({github: current.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), true);
  current.pr.labels = [{name: 'conference-event'}, {name: 'kp-reminder-due'}];
  assert.equal(await canPost({github: current.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: Date.parse('2026-10-28T19:01:00Z')}), false);
});

test('initialization, due bookkeeping, stock reminder, activity cleanup and reset', async () => {
  const f = fixture();
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), true);
  // Represent stock stale's comment-then-marker writes, not a custom commenter.
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  const count = f.writes.length;
  await f.run();
  assert.ok(f.writes.slice(count).every(([kind]) => kind === 'update'),
    'a successful review may persist only its separate checkpoint');
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  f.setTime('2026-10-29T20:00:00Z');
  f.humanComment();
  const activityAt = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-author-stalepr'), true);
  // The marker itself keeps the PR in stock stale's any-of label filter.
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  const resetWrites = f.writes.length;
  await f.run();
  assert.ok(f.writes.slice(resetWrites).every(([kind]) => kind === 'update'));
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
});

test('server-timed body/push/label changes reset; drafts/exemptions and absent membership never become due', async () => {
  for (const change of [
    f => {f.pr.body = 'Edited'; f.pr.lastEditedAt = '2026-10-27T21:00:00Z';},
    f => {
      f.pr.head.sha = 'def';
      f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human', type: 'User'},
        created_at: '2026-10-27T21:00:00Z'});
    },
    f => {
      f.pr.labels.push({name: 'human-label'});
      f.events.push({event: 'labeled', actor: {login: 'human', type: 'User'}, label: {name: 'human-label'},
        created_at: '2026-10-27T21:00:00Z'});
    }
  ]) {
    const f = fixture();
    await f.run();
    change(f); f.pr.updated_at = '2026-10-27T21:00:00Z';
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T21:00:00Z');
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
  for (const change of [
    f => {f.pr.draft = true;},
    f => {f.pr.labels.push({name: 'keep-open'});},
    f => {f.pr.labels = [];}
  ]) {
    const f = fixture(); change(f);
    f.setTime('2026-11-10T20:00:00Z');
    await f.run();
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
});

test('untrusted clocks ignored, invalid bot state and API failures fail explicitly', async () => {
  const f = fixture();
  f.comments.push({id: 99, body: PREFIX + '{}\n-->', user: {login: 'author', type: 'User'},
    created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
  await f.run();
  assert.equal(f.comments.length, 2);
  f.comments[1].body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  const g = fixture();
  g.github.rest.issues.getLabel = async () => {throw new Error('Missing required label');};
  await assert.rejects(g.run(), /Missing required label/);
  assert.equal(g.writes.length, 0);
  const h = fixture();
  await h.run();
  h.comments.push({...h.comments[0], id: 100, body: PREFIX + '{}\n-->'});
  await assert.rejects(h.run(), /Invalid persisted/);
});

test('recover activity before later bot writes, including edited old comments', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.setTime('2026-10-29T19:00:00Z');
  f.humanComment();
  const human = f.comments.at(-1);
  f.label('kp-author-stalepr', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  f.setTime('2026-10-30T19:00:00Z');
  human.updated_at = '2026-10-30T19:00:00Z';
  f.pr.updated_at = human.updated_at;
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
});

test('an existing marker without due is not disturbed to force a reminder', async () => {
  const f = fixture();
  f.pr.labels.push({name: 'kp-author-stalepr'});
  f.setTime('2026-11-10T20:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.writes.some(([kind]) => kind === 'add' || kind === 'remove'), false);
});

test('clock writes cannot hide racing author activity', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T18:00:00Z';
      f.pr.lastEditedAt = f.pr.updated_at;
      f.setTime('2026-10-27T19:00:00Z');
    }
    const original = f.github.rest.issues[method];
    let humanAt;
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      humanAt = f.pr.updated_at;
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(comment => comment.body.startsWith(PREFIX));
    assert.equal(readClock(clock).activityAt, humanAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting rereads activity and prevents stale eligibility from sending', async () => {
  for (const change of ['none', 'comment', 'push', 'body', 'draft', 'keep-open', 'retarget', 'during-read']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    if (change === 'comment') f.humanComment();
    if (change === 'push') f.pr.head.sha = 'new-commit';
    if (change === 'body') f.pr.body = 'New body';
    if (change === 'draft') f.pr.draft = true;
    if (change === 'keep-open') f.label('keep-open', true);
    if (change === 'retarget') f.pr.base.ref = 'main';
    if (change === 'during-read') {
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) f.humanComment();
        return get(args);
      };
    }
    const allowed = await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    });
    assert.equal(allowed, change === 'none', change);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
      ['none', 'during-read', 'push', 'body', 'draft', 'keep-open', 'retarget'].includes(change), change);
  }
});

test('posting rejects activity racing clock creation and update in that same pass', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T19:00:00Z';
      f.pr.lastEditedAt = f.pr.updated_at;
    }
    f.setTime('2026-10-30T20:01:00Z');
    const original = f.github.rest.issues[method];
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T20:02:00Z')
    }), false);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting fails explicitly on missing/duplicate clocks and API errors', async () => {
  for (const problem of ['missing', 'duplicate', 'api']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    if (problem === 'missing') f.comments.length = 0;
    if (problem === 'duplicate') f.comments.push(structuredClone(f.comments[0]));
    if (problem === 'api') f.github.rest.pulls.get = async () => {throw Error('Read failed');};
    await assert.rejects(canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    }), problem === 'api' ? /Read failed/ : problem === 'duplicate' ? /Invalid KP clock comment identity/ : /Expected one KP clock/);
  }
});

test('posting detects same-second issue and review comment count changes', async () => {
  for (const field of ['comments', 'review_comments']) {
    for (const delta of [0, 1, -1]) {
      const f = fixture();
      f.reviews.push({id: 500, body: 'Existing inline feedback', user: {login: 'reviewer', type: 'User'},
        created_at: f.pr.created_at, updated_at: f.pr.created_at});
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      f.pr.comments = f.comments.length;
      f.pr.review_comments = f.reviews.length;
      const timestamp = f.pr.updated_at;
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) {
          f.pr[field] += delta;
          assert.equal(f.pr.updated_at, timestamp, 'the race must not rely on a new timestamp');
        }
        return get(args);
      };
      const allowed = await canPost({
        github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
      });
      assert.equal(allowed, delta === 0, field + ':' + delta);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
        'unstable snapshots must leave bookkeeping for the next reconciliation');
    }
  }
});

test('review replies and edited inline feedback survive later bookkeeping', async () => {
  for (const edited of [false, true]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const feedbackAt = '2026-10-28T19:01:00Z';
    f.reviews.push({id: 100, body: 'Review feedback', user: {login: 'reviewer', type: 'User'},
      created_at: edited ? '2026-10-23T19:00:00Z' : feedbackAt, updated_at: feedbackAt});
    f.label('kp-reminder-due', true);
    const seen = [];
    const paginate = f.github.paginate;
    const read = async (endpoint, args) => {
      if (endpoint === f.github.rest.pulls.listReviewComments) seen.push(args);
      return paginate(endpoint, args);
    };
    read.iterator = paginate.iterator;
    f.github.paginate = read;
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, feedbackAt);
    assert.ok(seen.length >= 2);
    assert.ok(seen.every(args => args.per_page === 100 && args.pull_number === 42));
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('enrollment preserves idle time before writing the event label', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  assert.equal(await initialize(args), 'initialized');
  f.label('kp-conference-event', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  const count = f.comments.length;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.length, count);
  const g = fixture();
  g.github.rest.issues.createComment = async () => {throw Error('Clock write denied');};
  await assert.rejects(initialize({...args, github: g.github, pr: structuredClone(g.pr), now: g.time}), /Clock write denied/);
  assert.equal(g.writes.length, 0);
});

test('bot timestamp skew does not reset activity; review read failures remain errors', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  f.label('kp-author-stalepr', true);
  f.pr.updated_at = '2026-10-28T19:01:03Z';
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  const paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Review access denied');
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await assert.rejects(f.run(), /Review access denied/);
});

test('untrusted commit dates never override a server-timed force-push event', async () => {
  for (const date of ['2099-01-01T00:00:00Z', '2000-01-01T00:00:00Z']) {
    const f = fixture();
    await f.run();
    f.pr.head.sha = 'pushed-head';
    f.pr.updated_at = '2026-10-27T19:00:00Z';
    f.events.push({event: 'committed', committer: {date}, author: {date},
      created_at: date});
    f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human', type: 'User'},
      created_at: f.pr.updated_at});
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    f.setTime('2026-10-30T19:00:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T19:02:00Z')}), true);
  }
});

test('overlapping enrollment and backfill share the oldest trusted clock without deleting comments', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  const paginate = f.github.paginate;
  let release, reads = 0;
  const barrier = new Promise(resolve => {release = resolve;});
  const read = async (endpoint, params) => {
    if (endpoint !== f.github.rest.issues.listComments) return paginate(endpoint, params);
    const snapshot = await paginate(endpoint, params);
    if (++reads === 2) release();
    await barrier;
    return snapshot;
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await Promise.all([initialize(args), initialize(args)]);
  assert.equal(f.comments.length, 2, 'both initializers must observe an empty snapshot');
  const oldest = f.comments[0], duplicate = f.comments[1];
  const duplicateBody = duplicate.body;
  f.comments.reverse();
  f.github.paginate = paginate;
  f.label('kp-conference-event', true);
  await f.run();
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.equal(readClock(oldest).activityAt, '2026-10-23T19:00:00Z');
  assert.equal(await canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), true);
  f.humanComment();
  const latest = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(oldest).activityAt, latest);
  assert.equal(duplicate.body, duplicateBody);
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.filter(comment => comment.body.startsWith(PREFIX)).length, 2);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  duplicate.body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  await assert.rejects(initialize(args), /Invalid persisted/);
  await assert.rejects(canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), /Invalid persisted/);
});

test('restored PR descriptions retain server edit activity through later bot writes', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const original = f.pr.body;
  f.pr.body = 'Temporary description edit';
  f.pr.body = original;
  f.pr.lastEditedAt = '2026-10-28T19:01:30Z';
  f.pr.updated_at = f.pr.lastEditedAt;
  f.setTime('2026-10-28T19:02:00Z');
  f.label('kp-author-stalepr', true);
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, f.pr.lastEditedAt);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  f.github.graphql = async () => {throw Error('Edit activity access denied');};
  await assert.rejects(f.run(), /Edit activity access denied/);
  f.github.graphql = async () => ({repository: {pullRequest: null}});
  await assert.rejects(f.run(), /Missing or invalid server PR edit time/);
});

async function bodyEditFixture() {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const editedAt = '2026-10-28T19:01:30Z';
  f.pr.body = 'Permanent human description edit';
  f.pr.lastEditedAt = editedAt;
  f.pr.updated_at = editedAt;
  f.setTime('2026-10-28T19:02:00Z');
  f.label('kp-author-stalepr', true);
  f.setTime('2026-10-28T19:03:00Z');
  return f;
}

test('permanent human body edits retain their timed baseline after later own bookkeeping', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = await bodyEditFixture(), editedAt = f.pr.lastEditedAt;
  await f.run();
  const clock = f.comments[0];
  assert.equal(readClock(clock).activityAt, editedAt);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  for (const later of ['2026-10-29T19:03:00Z', '2026-10-30T19:03:00Z']) {
    f.setTime(later);
    await f.run();
    assert.equal(readClock(clock).activityAt, editedAt);
  }
  assert.equal(await hasActivitySince({github: f.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, since: '2026-10-28T19:01:00Z', now: f.github.time}), true);
  assert.equal(readClock(clock).activityAt, editedAt);
});

test('trusted body-only edits pass every entry point without using later Bot bookkeeping as activity', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = await bodyEditFixture(), clock = f.comments[0], before = readClock(clock);
    f.comments.push({id: 900, body: 'Later automated report', user: {login: 'checks', type: 'Bot'},
      created_at: '2026-10-28T19:02:30Z', updated_at: '2026-10-28T19:02:30Z'});
    f.pr.updated_at = '2026-10-28T19:02:30Z';
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.github.time};
    if (operation === 'initialize') assert.equal(await initialize({...args, pr: structuredClone(f.pr),
      eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'initialized');
    if (operation === 'reconcile') await f.run();
    if (operation === 'posting') assert.equal(await canPost(args), false);
    if (operation === 'cleanup') assert.equal(await hasActivitySince({...args,
      since: '2026-10-28T19:01:00Z'}), true);
    const accepted = readClock(clock);
    assert.equal(accepted.activityAt, f.pr.lastEditedAt);
    assert.equal(accepted.nonBodyFingerprint, before.nonBodyFingerprint);
    assert.equal(accepted.lastReviewedAt, '2026-10-28T19:03:00.000Z');
    assert.ok(!accepted.commentIds.issue.includes(900));
  }
});

test('newly observed body edits outside the overlap cannot be silently checkpointed as old activity', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
    f.pr.lastEditedAt = '2026-10-26T20:00:00Z';
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.github.time};
    if (operation === 'initialize') assert.equal(await initialize({...args, pr: structuredClone(f.pr),
      eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'skipped');
    if (operation === 'reconcile') await f.run();
    if (operation === 'posting') assert.equal(await canPost(args), false);
    if (operation === 'cleanup') assert.equal(await hasActivitySince({...args,
      since: '2026-10-28T19:01:00Z'}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
});

test('older body edit timing does not obscure a newer independently verified human activity baseline', async () => {
  const f = await bodyEditFixture();
  f.pr.lastEditedAt = '2026-10-26T20:00:00Z';
  f.humanComment();
  const humanAt = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, humanAt);
});

async function lateFeedbackFixture(kind, edited = false) {
  const f = fixture();
  const user = {login: 'human-reviewer', type: 'User', __typename: 'User'};
  const original = '2026-10-23T19:00:00Z', late = '2026-10-28T18:50:00Z';
  const entry = {id: 900, body: 'Human feedback', user, created_at: original, updated_at: original};
  const entries = kind === 'issue' ? f.comments : f.reviews;
  const summary = {submittedAt: original, lastEditedAt: null, author: user, editor: user};
  const summaries = [];
  if (kind === 'summary') {
    const graphql = f.github.graphql;
    f.github.graphql = async (...args) => {
      const result = await graphql(...args);
      result.repository.pullRequest.reviews.nodes = structuredClone(summaries);
      return result;
    };
  }
  if (edited && ['issue', 'inline'].includes(kind)) entries.push(entry);
  if (edited && kind === 'summary') summaries.push(summary);
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  if (['issue', 'inline'].includes(kind)) {
    if (!edited) {
      entry.created_at = late;
      entries.push(entry);
    }
    entry.updated_at = late;
    entry.body = 'Newly observed human feedback or edit';
    if (kind === 'inline') f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
  } else if (kind === 'summary') {
    if (edited) summary.lastEditedAt = late;
    else {
      summary.submittedAt = late;
      summaries.push(summary);
    }
  } else if (kind === 'timeline') {
    f.events.push({event: 'reviewed', actor: user, created_at: late});
  } else {
    f.pr.lastEditedAt = late;
  }
  f.setTime('2026-10-28T19:03:00Z');
  return f;
}

test('late human feedback outside overlap denies all entrypoints without advancing dates, IDs or labels', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const cases = [['issue', false], ['issue', true], ['inline', false], ['inline', true],
    ['summary', false], ['summary', true], ['timeline', false], ['restored-body', false]];
  for (const [kind, edited] of cases) for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = await lateFeedbackFixture(kind, edited);
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const before = clock.body, count = f.writes.length, labels = structuredClone(f.pr.labels), logs = [];
    for (const at of ['2026-10-28T19:03:00Z', '2026-10-29T19:03:00Z']) {
      f.setTime(at);
      const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info: message => logs.push(message)}, number: 42, now: f.time};
      if (operation === 'initialize') assert.equal(await initialize({...args, pr: structuredClone(f.pr),
        eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'skipped');
      if (operation === 'reconcile') await reconcile(args);
      if (operation === 'posting') assert.equal(await postingGate(args), false);
      if (operation === 'cleanup') assert.equal(await hasActivitySince({...args,
        since: '2026-10-28T18:40:00Z'}), null);
      assert.equal(clock.body, before, `${operation}/${kind}/${edited}`);
      assert.equal(f.writes.length, count);
      assert.deepEqual(f.pr.labels, labels);
    }
    assert.ok(logs.some(message => /Uncertain KP activity.*overlap.*skipped/.test(message)));
  }
});

test('older late feedback does not block a newer independently verified human baseline or repeat its reset', async () => {
  for (const [kind, edited] of [['issue', false], ['issue', true], ['inline', false], ['inline', true],
    ['summary', false], ['summary', true], ['timeline', false], ['restored-body', false]]) {
    const f = await lateFeedbackFixture(kind, edited);
    f.humanComment();
    const humanAt = f.pr.updated_at, clock = f.comments.find(item => item.body.startsWith(PREFIX));
    await f.run();
    assert.equal(readClock(clock).activityAt, humanAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    f.setTime('2026-10-29T19:03:00Z');
    await f.run();
    assert.equal(readClock(clock).activityAt, humanAt);
  }
});

test('later Bot reports, owned labels and excluded notifications cannot acknowledge missed human activity', async () => {
  const f = await lateFeedbackFixture('issue');
  const clock = f.comments.find(item => item.body.startsWith(PREFIX)), before = clock.body;
  const at = '2026-10-28T19:03:10Z';
  f.comments.push({id: 901, body: 'Later automated report', user: {login: 'checks', type: 'Bot'},
    created_at: at, updated_at: at});
  f.events.push({event: 'subscribed', actor: {login: 'subscriber', type: 'User'}, created_at: at},
    {id: 902, event: 'copilot_work_started', actor: {login: 'requester', type: 'User'}, created_at: at});
  f.setTime('2026-10-28T19:04:00Z');
  f.label('kp-reminder-due', true);
  const count = f.writes.length;
  await f.run();
  assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.time}), false);
  assert.equal(clock.body, before);
  assert.equal(f.writes.length, count);
});

test('nonbody provenance migrates only reproducible legacy state without resetting activity', async () => {
  const {fingerprint} = require('../scripts/kp-business-clock.cjs');
  for (const legacyHash of [false, true]) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0], state = readClock(clock);
    delete state.nonBodyFingerprint;
    state.extra = {preserve: true};
    if (legacyHash) state.fingerprint = fingerprint(f.pr, ['kp-reminder-due', 'kp-author-stalepr']);
    clock.body = PREFIX + JSON.stringify(state) + '\n-->';
    await f.run();
    const migrated = readClock(clock);
    assert.equal(migrated.activityAt, state.activityAt);
    assert.equal(migrated.nonBodyFingerprint,
      fingerprint({...f.pr, body: null}, ['kp-reminder-due', 'kp-author-stalepr'], 'kp-conference-event'));
    assert.deepEqual(migrated.extra, state.extra);
    f.pr.body = 'Body edit after verified migration';
    f.pr.lastEditedAt = '2026-10-28T19:01:30Z';
    f.pr.updated_at = f.pr.lastEditedAt;
    f.setTime('2026-10-28T19:02:00Z');
    f.label('kp-author-stalepr', true);
    f.setTime('2026-10-28T19:03:00Z');
    await f.run();
    assert.equal(readClock(clock).activityAt, f.pr.lastEditedAt);
  }
});

test('already ambiguous legacy bodies cannot invent nonbody provenance or authorize writes', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = await bodyEditFixture(), clock = f.comments[0], state = readClock(clock);
    delete state.nonBodyFingerprint;
    clock.body = PREFIX + JSON.stringify(state) + '\n-->';
    const before = clock.body, writes = f.writes.length, labels = structuredClone(f.pr.labels);
    for (const time of ['2026-10-29T19:03:00Z', '2026-10-30T19:03:00Z']) {
      f.setTime(time);
      const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.github.time};
      if (operation === 'initialize') assert.equal(await initialize({...args, pr: structuredClone(f.pr),
        eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'skipped');
      if (operation === 'reconcile') await f.run();
      if (operation === 'posting') assert.equal(await canPost(args), false);
      if (operation === 'cleanup') assert.equal(await hasActivitySince({...args,
        since: '2026-10-28T19:01:00Z'}), null);
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
      assert.deepEqual(f.pr.labels, labels);
      assert.equal(readClock(clock).nonBodyFingerprint, undefined);
    }
  }
});

test('timed body edits never hide concurrent untimed nonbody metadata changes', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const changes = [
    pr => {pr.head.sha = 'Concurrent head';},
    pr => {pr.title = 'Concurrent title';},
    pr => {pr.base.ref = 'release-ignite26-other';},
    pr => {pr.draft = true;},
    pr => {pr.milestone = {number: 7};},
    pr => {pr.assignees = [{login: 'new-assignee'}];},
    pr => {pr.requested_reviewers = [{login: 'new-reviewer'}];},
    pr => {pr.requested_teams = [{id: 7}];},
    pr => {pr.labels.push({name: 'new-human-label'});}
  ];
  for (const change of changes) for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
    change(f.pr);
    const labels = structuredClone(f.pr.labels);
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.github.time};
    if (operation === 'initialize') assert.equal(await initialize({...args, pr: structuredClone(f.pr),
      eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'skipped');
    if (operation === 'reconcile') await f.run();
    if (operation === 'posting') assert.equal(await canPost(args), false);
    if (operation === 'cleanup') assert.equal(await hasActivitySince({...args,
      since: '2026-10-28T19:01:00Z'}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    assert.deepEqual(f.pr.labels, labels);
  }
});

test('body recovery requires independently timed human attribution and preserves fatal API schema', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const problem of ['Bot', 'missing-time', 'future-time', 'missing-actor', 'conflicting-actor',
    'malformed-time', 'numeric-time']) {
    for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
      const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
      if (problem === 'Bot') f.pr.editor = {login: 'editor', __typename: 'Bot'};
      if (problem === 'missing-time') f.pr.lastEditedAt = null;
      if (problem === 'future-time') f.pr.lastEditedAt = '2026-10-30T20:00:00Z';
      if (problem === 'missing-actor') f.pr.editor = {};
      if (problem === 'conflicting-actor') f.pr.editor = {login: 'editor', type: 'User', __typename: 'Bot'};
      if (problem === 'malformed-time') f.pr.lastEditedAt = 'not-a-time';
      if (problem === 'numeric-time') f.pr.lastEditedAt = 2026;
      const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.github.time};
      const run = () => operation === 'initialize' ? initialize({...args, pr: structuredClone(f.pr),
        eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
        : operation === 'reconcile' ? f.run() : operation === 'posting' ? canPost(args)
          : hasActivitySince({...args, since: '2026-10-28T19:01:00Z'});
      if (['malformed-time', 'numeric-time'].includes(problem)) {
        await assert.rejects(run, /Missing or invalid server PR edit time/);
      } else {
        assert.equal(await run(), operation === 'initialize' ? 'skipped'
          : operation === 'cleanup' ? null : operation === 'posting' ? false : undefined);
      }
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('body attribution or metadata changing during guarded verification denies new state and cleanup', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const race of ['editor', 'time', 'head', 'api']) {
    const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
    const original = f.github.graphql;
    if (race === 'head') {
      const get = f.github.rest.pulls.get;
      let prReads = 0;
      f.github.rest.pulls.get = async (...args) => {
        if (++prReads === 2) f.pr.head.sha = 'Concurrent verification head';
        return get(...args);
      };
    }
    let reads = 0;
    f.github.graphql = async (...args) => {
      if (++reads === 2) {
        if (race === 'api') throw Error('Body verification API denied');
        if (race === 'editor') f.pr.editor = {login: 'editor', __typename: 'Bot'};
        if (race === 'time') f.pr.lastEditedAt = '2026-10-28T19:01:31Z';
      }
      return original(...args);
    };
    const run = () => hasActivitySince({github: f.github,
      context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
      number: 42, since: '2026-10-28T19:01:00Z', now: f.github.time});
    if (race === 'api') await assert.rejects(run, /Body verification API denied/);
    else assert.equal(await run(), null, race);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
});

test('body-edit pagination must agree on independent editor and time before trusting provenance', async () => {
  for (const race of ['none', 'editor', 'time']) {
    const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
    const original = f.github.graphql;
    f.github.graphql = async (query, params) => {
      const response = await original(query, params), record = response.repository.pullRequest;
      record.reviews.pageInfo = {hasNextPage: !params.after, endCursor: params.after ? null : 'next'};
      if (params.after && race === 'editor') record.editor = {login: 'other-editor', __typename: 'User'};
      if (params.after && race === 'time') record.lastEditedAt = '2026-10-28T19:01:31Z';
      return response;
    };
    await f.run();
    if (race === 'none') assert.equal(readClock(clock).activityAt, f.pr.lastEditedAt);
    else {
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('failed body-provenance saves are fatal and retries preserve the independent edit date', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = await bodyEditFixture(), clock = f.comments[0], before = clock.body, writes = f.writes.length;
  const update = f.github.rest.issues.updateComment;
  f.github.rest.issues.updateComment = async () => {throw Error('Body provenance save denied');};
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, since: '2026-10-28T19:01:00Z', now: f.github.time};
  await assert.rejects(hasActivitySince(args), /Body provenance save denied/);
  assert.equal(clock.body, before);
  assert.equal(f.writes.length, writes);
  f.github.rest.issues.updateComment = update;
  assert.equal(await hasActivitySince(args), true);
  assert.equal(readClock(clock).activityAt, f.pr.lastEditedAt);
  assert.equal(typeof readClock(clock).nonBodyFingerprint, 'string');
  f.setTime('2026-10-29T19:03:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, f.pr.lastEditedAt);
});

test('malformed persisted nonbody provenance stays fatal at every entry point', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const value of [null, '', 'abc', 'A'.repeat(64), 'x'.repeat(64), 123, [], {}]) {
    for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
      const f = fixture();
      await f.run();
      const clock = f.comments[0], state = readClock(clock), writes = f.writes.length;
      state.nonBodyFingerprint = value;
      clock.body = PREFIX + JSON.stringify(state) + '\n-->';
      const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.github.time};
      const run = () => operation === 'initialize' ? initialize({...args, pr: structuredClone(f.pr),
        eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
        : operation === 'reconcile' ? f.run() : operation === 'posting' ? canPost(args)
          : hasActivitySince({...args, since: '2026-10-23T19:00:00Z'});
      await assert.rejects(run, /Invalid persisted KP nonbody provenance/);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('existing enrollment without a clock cannot use an unexplained latest update after owned bookkeeping', async () => {
  const f = fixture();
  f.events.push({event: 'labeled', label: {name: 'kp-conference-event'},
    actor: {login: 'github-actions[bot]', type: 'Bot'}, created_at: '2026-10-24T19:00:00Z'});
  f.pr.updated_at = '2026-10-28T18:00:00Z';
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.deepEqual(f.comments, []);
  assert.deepEqual(f.writes, []);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
});

test('edited submitted review summaries reset inactivity across all GraphQL pages', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const editedAt = '2026-10-28T19:01:30Z';
  const after = [];
  f.github.graphql = async (query, params) => {
    after.push(params.after);
    return {repository: {pullRequest: {lastEditedAt: null, reviews: {
      nodes: params.after ? [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: editedAt,
        author: {login: 'reviewer', __typename: 'User'}, editor: {login: 'reviewer', __typename: 'User'}}]
        : [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: null,
          author: {login: 'reviewer', __typename: 'User'}}],
      pageInfo: {hasNextPage: !params.after, endCursor: params.after ? null : 'review-page-2'}
    }}}};
  };
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, editedAt);
  assert.ok(after.includes(null) && after.includes('review-page-2'));
  const writes = f.writes.length;
  for (const problem of ['denied', 'missing', 'repeat', 'timestamp']) {
    f.github.graphql = async () => {
      if (problem === 'denied') throw Error('Review summary read denied');
      return {repository: {pullRequest: {lastEditedAt: null, reviews: problem === 'missing' ? null : {
        nodes: problem === 'timestamp' ? [{submittedAt: 'invalid', lastEditedAt: null}] : [],
        pageInfo: {hasNextPage: true, endCursor: 'repeated'}
      }}}};
    };
    await assert.rejects(f.run(), /Review summary read denied|Missing review-summary|Invalid review-summary/);
    assert.equal(f.writes.length, writes);
  }
});

test('posting persists observed push and body activity before removing its due label', async () => {
  for (const change of ['push', 'body']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    await f.run();
    if (change === 'push') f.pr.head.sha = 'new-push';
    else f.pr.body = 'New description';
    const activityAt = '2026-10-28T19:01:30Z';
    f.pr.updated_at = activityAt;
    if (change === 'push') f.events.push({event: 'head_ref_force_pushed',
      actor: {login: 'human', type: 'User'}, created_at: activityAt});
    else f.pr.lastEditedAt = activityAt;
    f.setTime('2026-10-28T19:02:00Z');
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt, 'bot removals must not restart inactivity');
  }
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  await f.run();
  f.pr.head.sha = 'new-push';
  f.pr.updated_at = '2026-10-28T19:01:30Z';
  f.events.push({event: 'head_ref_force_pushed', actor: {login: 'human', type: 'User'}, created_at: f.pr.updated_at});
  f.github.rest.issues.updateComment = async () => {throw Error('Clock persistence denied');};
  await assert.rejects(canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), /Clock persistence denied/);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('deleted issue and inline comments reset from observation even with equal replacement counts', async () => {
  for (const kind of ['issue', 'review']) {
    for (const posting of [false, true]) {
      const f = fixture();
      const entries = kind === 'issue' ? f.comments : f.reviews;
      entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer', type: 'User'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
      entries.splice(entries.findIndex(item => item.id === 500), 1);
      entries.push({id: 501, body: 'Replacement feedback', user: {login: 'reviewer', type: 'User'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      const observedAt = '2026-10-28T19:02:00.000Z';
      f.setTime(observedAt);
      if (posting) {
        assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: Date.parse(observedAt)}), false);
      } else await f.run();
      const clock = f.comments.find(item => item.body.startsWith(PREFIX));
      assert.equal(readClock(clock).activityAt, observedAt);
      assert.deepEqual(readClock(clock).commentIds[kind], [501]);
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-10-29T19:02:00Z');
      await f.run();
      assert.equal(readClock(clock).activityAt, observedAt, 'unchanged snapshots and bookkeeping do not reset again');
      f.setTime('2026-11-02T20:01:59Z');
      await f.run();
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-11-02T20:02:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    }
  }
});

test('comment identity baselines migrate without resetting and reject incomplete or malformed state', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0], legacy = readClock(clock);
  delete legacy.commentIds;
  delete legacy.feedbackPolicy;
  delete legacy.confirmedDeletedReviewIds;
  clock.body = PREFIX + JSON.stringify(legacy) + '\n-->';
  const feedback = Array.from({length: 205}, (_, index) => ({id: 500 + index,
    body: 'Feedback', user: {login: 'reviewer', type: 'User'}, updated_at: '2026-10-23T19:00:00Z'}));
  f.comments.push(...feedback);
  const seen = [], paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    seen.push([endpoint, args.per_page]);
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await f.run();
  assert.equal(readClock(clock).activityAt, legacy.activityAt);
  assert.equal(readClock(clock).commentIds.issue.length, 205);
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.issues.listComments && size === 100));
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.pulls.listReviewComments && size === 100));
  const activityAt = readClock(clock).activityAt;
  f.comments.reverse();
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  await f.run();
  const writes = f.writes.length;
  f.comments.splice(f.comments.findIndex(item => item.body === process.env.AUTHOR_REMINDER_MESSAGE), 1);
  await f.run();
  assert.equal(readClock(clock).activityAt, activityAt);
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'),
    'stock reminder deletion may advance the scan checkpoint, never inactivity');
  const afterCheckpoint = f.writes.length;
  const valid = clock.body;
  for (const commentIds of [null, {}, {issue: [2, 1], review: []},
    {issue: [1, 1], review: []}, {issue: ['1'], review: []},
    {issue: [Number.MAX_SAFE_INTEGER + 1], review: []}]) {
    clock.body = PREFIX + JSON.stringify({...readClock({body: valid}), commentIds}) + '\n-->';
    await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
    assert.equal(f.writes.length, afterCheckpoint);
  }
  clock.body = valid;
  feedback[0].id = 0;
  await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
  assert.equal(f.writes.length, afterCheckpoint);
  feedback[0].id = 500;
  f.github.paginate = Object.assign(async endpoint => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Comment snapshot read denied');
    return paginate(endpoint);
  }, {iterator: paginate.iterator});
  await assert.rejects(f.run(), /Comment snapshot read denied/);
  assert.equal(f.writes.length, afterCheckpoint);
});

test('visible clock uses operative activityAt in Redmond, preserving creation provenance across DST', async () => {
  for (const [createdAt, display] of [
    ['2026-10-31T13:24:23Z', '2026-10-31 06:24:23 PDT (UTC-07:00)'],
    ['2026-11-01T08:30:00Z', '2026-11-01 01:30:00 PDT (UTC-07:00)'],
    ['2026-11-01T09:30:00Z', '2026-11-01 01:30:00 PST (UTC-08:00)'],
    ['2026-03-08T09:59:59Z', '2026-03-08 01:59:59 PST (UTC-08:00)'],
    ['2026-03-08T10:00:00Z', '2026-03-08 03:00:00 PDT (UTC-07:00)']
  ]) {
    const f = fixture();
    f.pr.created_at = f.pr.updated_at = createdAt;
    f.setTime(new Date(Date.parse(createdAt) - 1000).toISOString());
    f.setTime(createdAt);
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const visible = 'Created by PR Monitor bot for Ignite 2026 from the Knowledge Partnership team.\n' +
      '3 day clock started on ' + display;
    assert.ok(clock.body.endsWith(visible));
    assert.equal(clock.created_at, new Date(Date.parse(createdAt) + 1000).toISOString());
    assert.equal(f.writes.filter(([kind]) => kind === 'comment').length, 1);
    assert.equal(f.writes.filter(([kind]) => kind === 'update').length, 0);
    const start = clock.created_at;
    const initialActivity = readClock(clock).activityAt;
    f.setTime('2027-01-05T20:00:00Z');
    f.humanComment();
    const feedbackAt = f.comments.at(-1).created_at;
    await f.run();
    assert.equal(clock.created_at, start);
    assert.ok(!clock.body.endsWith(visible));
    assert.match(clock.body, /3 day clock started on 2027-01-05 12:00:01 PST \(UTC-08:00\)$/);
    assert.equal(readClock(clock).activityAt, feedbackAt);
    assert.equal(initialActivity, createdAt, 'display must not reset pre-enrollment activity');
    const writes = f.writes.length;
    await f.run();
    assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
    assert.equal(readClock(clock).activityAt, feedbackAt, 'checkpoint does not move inactivity');
  }
});

test('legacy wording upgrades the same clock once and preserves its full hidden state', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const enrollment of [false, true]) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0];
    const state = readClock(clock);
    state.legacyExtra = 'preserve';
    clock.body = PREFIX + JSON.stringify(state) +
      '\n-->\nBusiness-day reminder clock (managed by the documentation bot).';
    const id = clock.id, createdAt = clock.created_at;
    f.setTime('2026-11-10T20:00:00Z');
    const run = enrollment ? () => initialize({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
      pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
      managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time
    }) : f.run;
    const updates = f.writes.filter(([kind]) => kind === 'update').length;
    await run();
    assert.equal(clock.id, id);
    assert.equal(clock.created_at, createdAt);
    assert.deepEqual({...readClock(clock), lastReviewedAt: state.lastReviewedAt, observedAt: state.observedAt}, state);
    assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
    assert.equal(f.writes.filter(([kind]) => kind === 'update').length, updates + 1);
    const writes = f.writes.length;
    await run();
    assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
    assert.equal(f.comments.length, 1);
  }
});

test('a failed wording update recovers the existing clock rather than replacing it', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time};
  await initialize(args);
  const persisted = readClock(f.comments[0]);
  f.comments[0].body = PREFIX + JSON.stringify(persisted) + '\n-->\nLegacy wording';
  args.pr = structuredClone(f.pr);
  const update = f.github.rest.issues.updateComment;
  f.github.rest.issues.updateComment = async () => {throw Error('Wording update failed');};
  await assert.rejects(initialize(args), /Wording update failed/);
  assert.equal(f.comments.length, 1);
  const clock = f.comments[0], state = readClock(clock);
  f.github.rest.issues.updateComment = update;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments[0], clock);
  assert.equal(f.comments.length, 1);
  assert.deepEqual({...readClock(clock), lastReviewedAt: state.lastReviewedAt, observedAt: state.observedAt}, state);
  assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
  const writes = f.writes.length;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
  const beforeInvalid = f.writes.length;
  delete clock.created_at;
  await assert.rejects(initialize({...args, pr: structuredClone(f.pr)}), /clock creation time/);
  assert.equal(f.writes.length, beforeInvalid, 'invalid server metadata must not invent a start time');
});

test('a temporarily omitted feedback identity is not persisted as deletion', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer', type: 'User'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const before = clock.body, writes = f.writes.length;
    const paginate = f.github.paginate;
    const endpoint = kind === 'issue' ? f.github.rest.issues.listComments : f.github.rest.pulls.listReviewComments;
    let reads = 0;
    f.github.paginate = Object.assign(async (method, args) => {
      assert.equal(args.per_page, 100);
      const snapshot = await paginate(method, args);
      return method === endpoint && ++reads === 1 ? snapshot.filter(item => item.id !== 500) : snapshot;
    }, {iterator: paginate.iterator});
    await f.run();
    assert.equal(readClock(clock).activityAt, readClock({body: before}).activityAt);
    assert.equal(f.writes.length, writes);
    f.github.paginate = paginate;
    await f.run();
    assert.equal(readClock(clock).activityAt, readClock({body: before}).activityAt);
  }
});

test('confirmed deletion uses read completion, with the exact fractional weekday deadline across DST', async () => {
  for (const kind of ['issue', 'review']) for (const posting of [false, true]) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer', type: 'User'},
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    f.setTime('2026-10-28T19:02:00Z');
    const paginate = f.github.paginate;
    let issueReads = 0, reviewReads = 0;
    f.github.paginate = Object.assign(async (method, args) => {
      if (method === f.github.rest.issues.listComments && ++issueReads === 1) {
        f.setTime('2026-10-28T19:02:10.250Z');
        entries.splice(entries.findIndex(item => item.id === 500), 1);
      }
      if (method === f.github.rest.pulls.listReviewComments && ++reviewReads === 2) {
        f.setTime('2026-10-28T19:02:12.750Z');
      }
      return paginate(method, args);
    }, {iterator: paginate.iterator});
    if (posting) {
      assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.time}), false);
    } else await f.run();
    assert.equal(readClock(f.comments.find(item => item.body.startsWith(PREFIX))).activityAt,
      '2026-10-23T19:00:00Z', 'count mismatch must wait for a fresh consistent PR snapshot');
    if (posting) {
      assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: f.time}), false);
    } else await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    assert.equal(readClock(clock).activityAt, '2026-10-28T19:02:12.750Z');
    assert.ok(issueReads >= 3);
    assert.ok(reviewReads >= 3);
    f.github.paginate = paginate;
    f.setTime('2026-11-02T20:02:12.749Z');
    await f.run();
    assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
    assert.equal(isDue(readClock(clock).activityAt, Date.parse('2026-11-02T20:02:12.749Z'), 3), false);
    assert.equal(isDue(readClock(clock).activityAt, Date.parse('2026-11-02T20:02:12.750Z'), 3), true);
    f.setTime('2026-11-02T20:02:14.000Z');
    await f.run();
    assert.ok(f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  }
});

test('after-bookkeeping guard ignores its own wording edit and permits the normal stock reminder', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments[0], activityAt = readClock(clock).activityAt;
  clock.body = PREFIX + JSON.stringify(readClock(clock)) + '\n-->\nLegacy wording';
  const gate = () => canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')});
  assert.equal(await gate(), true);
  assert.equal(readClock(clock).activityAt, activityAt);
  const writes = f.writes.length;
  assert.equal(await gate(), true);
  assert.ok(f.writes.slice(writes).every(([kind]) => kind === 'update'));
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  assert.equal(await gate(), false);
  await f.run();
  assert.ok(f.pr.labels.some(item => item.name === 'kp-author-stalepr'));
  assert.ok(!f.writes.slice(writes).some(([kind, name]) =>
    kind === 'remove' && name === 'kp-author-stalepr'), 'helper must not deliberately re-arm stock markers');
});

test('after-bookkeeping first-reminder guard rejects new feedback and scope changes', async () => {
  for (const change of ['comment', 'review', 'push', 'body', 'draft', 'keep-open', 'retarget', 'closed', 'clock']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments[0];
    clock.body = PREFIX + JSON.stringify(readClock(clock)) +
      '\n-->\nBusiness-day reminder clock (managed by the documentation bot).';
    const update = f.github.rest.issues.updateComment;
    let activityAt;
    f.github.rest.issues.updateComment = async args => {
      if (change === 'comment') {f.humanComment(); activityAt = f.pr.updated_at;}
      if (change === 'review') {
        activityAt = '2026-10-28T19:02:30Z';
        f.reviews.push({id: 500, body: 'New review', user: {login: 'reviewer', type: 'User'},
          created_at: activityAt, updated_at: activityAt});
      }
      if (change === 'push') f.pr.head.sha = 'after-bookkeeping-push';
      if (change === 'body') f.pr.body = 'After-bookkeeping body';
      if (change === 'draft') f.pr.draft = true;
      if (change === 'keep-open') f.label('keep-open', true);
      if (change === 'retarget') f.pr.base.ref = 'main';
      if (change === 'closed') f.pr.state = 'closed';
      f.github.rest.issues.updateComment = update;
      const response = await update(args);
      if (change === 'clock') clock.body = PREFIX + JSON.stringify({
        ...readClock(clock), activityAt: '2026-10-28T19:02:30Z'
      }) + '\n-->';
      return response;
    };
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false, change);
    assert.equal(f.comments.filter(item => item.body.startsWith(PREFIX)).length, 1);
    assert.equal(f.comments.filter(item => item.body === process.env.AUTHOR_REMINDER_MESSAGE).length, 0);
    if (activityAt) {
      await f.run();
      assert.equal(readClock(clock).activityAt, activityAt);
    }
  }
});

test('same-second issue edits during bookkeeping are compared without adding persisted revision fields', async () => {
  const f = fixture();
  f.comments.push({id: 500, body: 'Original feedback', user: {login: 'reviewer', type: 'User'},
    created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments.find(item => item.body.startsWith(PREFIX));
  clock.body = PREFIX + JSON.stringify(readClock(clock)) + '\n-->\nLegacy wording';
  const update = f.github.rest.issues.updateComment;
  f.github.rest.issues.updateComment = async args => {
    f.comments.find(item => item.id === 500).body = 'Edited feedback';
    return update(args);
  };
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), false);
  assert.deepEqual(Object.keys(readClock(clock)).sort(),
    ['activityAt', 'commentIds', 'confirmedDeletedReviewIds', 'feedbackPolicy', 'fingerprint', 'lastReviewedAt',
      'nonBodyFingerprint', 'observedAt']);
});

test('rollout labels cannot authorize an off-prefix target and missing prefix fails explicitly', async () => {
  const f = fixture();
  f.pr.base.ref = 'main';
  f.setTime('2026-11-10T20:00:00Z');
  await f.run();
  assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  f.label('kp-reminder-due', true);
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-11-10T20:01:00Z')}), false);
  assert.ok(!f.pr.labels.some(item => item.name === 'kp-reminder-due'));
  delete process.env.ROLLOUT_BRANCH_PREFIX;
  const writes = f.writes.length;
  await assert.rejects(f.run(), /Invalid KP business clock settings/);
  assert.equal(f.writes.length, writes);
});

test('enrollment, plain reminder, notification events and next review preserve the operative baseline', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
  f.label('kp-conference-event', true);
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const clock = f.comments[0], anchor = readClock(clock).activityAt;
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.time()}), true);
  const body = process.env.AUTHOR_REMINDER_MESSAGE;
  assert.equal(body, process.env.AUTHOR_REMINDER_MESSAGE);
  await f.github.rest.issues.createComment({body});
  f.label('kp-author-stalepr', true);
  f.events.push(
    {event: 'mentioned', actor: {login: 'pr-author', type: 'User'}, created_at: f.pr.updated_at},
    {event: 'subscribed', actor: {login: 'manual-subscriber', type: 'User'}, created_at: f.pr.updated_at});
  f.setTime('2026-10-28T20:01:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, anchor);
  assert.equal(readClock(clock).lastReviewedAt, '2026-10-28T20:01:00.000Z');
  assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  f.setTime('2026-10-29T20:01:00Z');
  f.humanComment();
  const response = f.comments.at(-1).updated_at;
  await f.run();
  assert.equal(readClock(clock).activityAt, response);
  assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('bot feedback is excluded, bot metadata remains guarded and human reminder copies remain meaningful', async () => {
  for (const kind of ['comment', 'label', 'human-reminder-copy']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-27T20:00:00Z');
    const at = new Date(f.time()).toISOString();
    f.pr.updated_at = at;
    if (kind === 'label') {
      f.pr.labels.push({name: 'validation-failed'});
      f.events.push({event: 'labeled', actor: {login: 'github-actions[bot]', type: 'Bot'},
        label: {name: 'validation-failed'}, created_at: at});
    } else {
      f.comments.push({id: 900, user: {login: kind === 'comment' ? 'github-actions[bot]' : 'author',
        type: kind === 'comment' ? 'Bot' : 'User'},
        body: kind === 'comment' ? 'Another workflow failed validation' : process.env.AUTHOR_REMINDER_MESSAGE,
        created_at: at, updated_at: at});
    }
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt,
      kind === 'human-reminder-copy' ? at : '2026-10-23T19:00:00Z', kind);
  }
});

test('legacy membership hashes normalize only reproducible current metadata, without backdating', async () => {
  const {fingerprint} = require('../scripts/kp-business-clock.cjs');
  for (const originalMember of [false, true]) {
    const f = fixture();
    await f.run();
    const comment = f.comments[0], legacy = readClock(comment);
    const oldPR = {...f.pr, labels: originalMember ? f.pr.labels : []};
    legacy.fingerprint = fingerprint(oldPR, ['kp-reminder-due', 'kp-author-stalepr']);
    delete legacy.lastReviewedAt;
    comment.body = PREFIX + JSON.stringify(legacy) + '\n-->';
    f.setTime('2026-10-27T20:00:00Z');
    if (!originalMember) f.label('kp-conference-event', true);
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(comment).activityAt, legacy.activityAt);
    assert.equal(readClock(comment).fingerprint,
      fingerprint(f.pr, ['kp-reminder-due', 'kp-author-stalepr'], 'kp-conference-event'));
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  }
});

test('uncertain metadata or unknown events skip without checkpoint writes or reminder authorization', async () => {
  for (const kind of ['metadata', 'unknown-event']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments[0], before = clock.body, count = f.writes.length;
    if (kind === 'metadata') f.pr.head.sha = 'push-time-obscured-by-clock-write';
    else f.events.push({event: 'unrecognized-server-event', created_at: f.pr.updated_at});
    const logs = [];
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info: message => logs.push(message)}, number: 42, now: f.time}), false);
    assert.ok(logs.some(message => /Uncertain KP activity.*skipped/.test(message)));
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, count);
  }
});

test('review checkpoints store start, not completion, and overlapping old edits do not rearm twice', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0];
  const start = '2026-10-27T20:00:00.000Z';
  f.setTime(start);
  const graphql = f.github.graphql;
  let delayed = false;
  f.github.graphql = async (...args) => {
    if (!delayed) {
      delayed = true;
      f.setTime('2026-10-27T20:02:00Z');
    }
    return graphql(...args);
  };
  await f.run();
  assert.equal(readClock(clock).lastReviewedAt, start);
  const editedAt = '2026-10-27T19:56:00Z';
  f.comments.push({id: 500, body: 'Old comment edited within overlap', user: {login: 'reviewer', type: 'User'},
    created_at: '2026-10-20T19:00:00Z', updated_at: editedAt});
  f.pr.updated_at = editedAt;
  f.setTime('2026-10-27T20:03:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, editedAt);
  f.setTime('2026-10-27T20:04:00Z');
  await f.run();
  assert.equal(readClock(clock).activityAt, editedAt, 'same overlapping edit must not reset from observation');
});

test('failed or concurrent reviews leave the checkpoint for retry and retain full feedback identities', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body;
  f.setTime('2026-10-27T20:00:00Z');
  const graphql = f.github.graphql;
  let reads = 0;
  f.github.graphql = async (...args) => {
    if (++reads === 2) throw Error('Second review unavailable');
    return graphql(...args);
  };
  await assert.rejects(f.run(), /Second review unavailable/);
  assert.equal(clock.body, before);
  f.github.graphql = graphql;
  f.comments.push({id: 500, body: 'An old comment edited since the last successful scan',
    user: {login: 'reviewer', type: 'User'}, created_at: '2026-10-20T19:00:00Z', updated_at: '2026-10-27T19:59:00Z'});
  await f.run();
  assert.equal(readClock(clock).activityAt, '2026-10-27T19:59:00Z');
  assert.deepEqual(readClock(clock).commentIds.issue, [500]);
});

test('first enrollment seeds issue and inline identities so first-scan deletions are observed once', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['issue', 'review']) {
    const f = fixture(), entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, user: {login: 'reviewer', type: 'User'}, body: 'Before enrollment',
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
    await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
      managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    assert.deepEqual(readClock(clock).commentIds[kind], [500]);
    entries.splice(entries.findIndex(item => item.id === 500), 1);
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const observed = readClock(clock).activityAt;
    assert.equal(observed, '2026-10-28T19:01:00.000Z');
    await f.run();
    assert.equal(readClock(clock).activityAt, observed);
    assert.ok(!f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  }
});

test('same-second issue and inline edits on an otherwise unchanged clock gate are not lost', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture(), entries = kind === 'issue' ? f.comments : f.reviews;
    const comment = {id: 500, user: {login: 'reviewer', type: 'User'}, body: 'Original',
      created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'};
    entries.push(comment);
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(item => item.body.startsWith(PREFIX));
    const before = clock.body, get = f.github.rest.pulls.get;
    let reads = 0;
    f.github.rest.pulls.get = async args => {
      if (++reads === 2) {
        comment.body = 'Edited within same server second';
        comment.updated_at = new Date(f.time()).toISOString();
      }
      return get(args);
    };
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
    assert.equal(clock.body, before, 'failed review must not acknowledge the racing edit');
    await f.run();
    assert.equal(readClock(clock).activityAt, comment.updated_at);
  }
});

test('enrollment recognizes the exact shipped reminder when sender-only environment is absent', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const fs = require('node:fs'), path = require('node:path');
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows', 'reusable-kp-reminder.yml'), 'utf8');
  const message = workflow.split('      AUTHOR_REMINDER_MESSAGE: |-\n')[1].split('\n\n    steps:')[0]
    .split('\n').map(line => line.startsWith('        ') ? line.slice(8) : line).join('\n');
  const f = fixture();
  f.comments.push({id: 500, user: {login: 'github-actions[bot]', type: 'Bot'}, body: '@old-author\n\n' + message,
    created_at: '2026-10-24T19:00:00Z', updated_at: '2026-10-24T19:00:00Z'});
  delete process.env.AUTHOR_REMINDER_MESSAGE;
  await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
    managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.time});
  const clock = f.comments.find(item => item.body.startsWith(PREFIX));
  assert.equal(readClock(clock).activityAt, '2026-10-23T19:00:00Z');
  assert.deepEqual(readClock(clock).commentIds.issue, []);
});

test('marker cleanup uses genuine activity, not checkpoint writes or manual subscription notifications', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  const since = f.pr.updated_at;
  f.events.push({event: 'subscribed', actor: {login: 'manual-subscriber', type: 'User'}, created_at: since});
  f.setTime('2026-10-28T20:01:00Z');
  await f.run();
  const check = () => hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, since, now: f.time});
  assert.ok(Date.parse(f.pr.updated_at) - Date.parse(since) > 15000);
  assert.equal(await check(), false);
  f.humanComment();
  assert.equal(await check(), true);
  await f.run();
  assert.equal(await check(), true, 'persisting genuine activity must not suppress existing marker cleanup');
});

test('uncertain or missing marker boundary never authorizes cleanup or advances a review checkpoint', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body, count = f.writes.length, logs = [];
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info: message => logs.push(message)}, number: 42, now: f.time};
  assert.equal(await hasActivitySince(args), null);
  f.pr.head.sha = 'time-obscured-by-clock-write';
  assert.equal(await hasActivitySince({...args, since: '2026-10-23T19:00:00Z'}), null);
  assert.equal(clock.body, before);
  assert.equal(f.writes.length, count);
  assert.ok(logs.some(message => /Uncertain KP/.test(message)));
});

test('marker cleanup without a trusted clock retains the marker without failing or writing', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const impersonation of [false, true]) {
    const f = fixture(), logs = [];
    f.label('kp-author-stalepr', true);
    if (impersonation) f.comments.push({id: 900, body: PREFIX + 'not a trusted clock',
      user: {login: 'human', type: 'User'}, created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
    else await f.run();
    assert.ok(!f.comments.some(item => item.user.type === 'Bot' && item.body.startsWith(PREFIX)));
    const count = f.writes.length, comments = structuredClone(f.comments), labels = structuredClone(f.pr.labels);
    f.github.graphql = async () => {throw Error('Missing clock must not start an activity review');};
    for (let scan = 0; scan < 2; scan++) {
      assert.equal(await hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info: message => logs.push(message)}, number: 42,
        since: '2026-10-23T19:00:00Z', now: f.time}), null);
      assert.equal(f.writes.length, count);
      assert.deepEqual(f.comments, comments);
      assert.deepEqual(f.pr.labels, labels);
    }
    assert.ok(logs.some(message => /no trusted.*clock.*skipped marker cleanup/i.test(message)));
  }
});

test('cleanup still fails explicitly for malformed persisted clocks and genuine PR or comment read errors', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const failure of ['persisted', 'pull-read', 'comments-read']) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0], count = f.writes.length;
    if (failure === 'persisted') clock.body = PREFIX + '{}\n-->';
    if (failure === 'pull-read') f.github.rest.pulls.get = async () => {throw Error('PR access denied');};
    if (failure === 'comments-read') f.github.paginate = async () => {throw Error('Comments access denied');};
    await assert.rejects(hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, since: '2026-10-23T19:00:00Z', now: f.time}),
    failure === 'persisted' ? /Invalid persisted KP clock/
      : failure === 'pull-read' ? /PR access denied/ : /Comments access denied/);
    assert.equal(f.writes.length, count);
  }
});

test('KP cleanup timestamp skew and excluded notifications cannot supply a metadata reset time', async () => {
  for (const notification of [null, 'subscribed', 'unsubscribed']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
    f.label('kp-author-stalepr', true);
    await f.run();
    const clock = f.comments[0], before = clock.body, count = f.writes.length;
    f.pr.labels.push({name: 'keep-open'});
    f.events.push({event: 'labeled', label: {name: 'keep-open'}, actor: {login: 'human', type: 'User'},
      created_at: '2026-10-29T18:00:00Z'});
    f.setTime('2026-10-29T19:00:00Z');
    f.label('kp-author-stalepr', false);
    f.pr.updated_at = notification ? '2026-10-29T19:00:04Z' : '2026-10-29T19:00:03Z';
    if (notification) f.events.push({event: notification, actor: {login: 'manual-subscriber', type: 'User'},
      created_at: f.pr.updated_at});
    f.setTime('2026-10-29T19:00:05Z');
    const afterExternalWrites = f.writes.length;
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, afterExternalWrites);
    assert.ok(afterExternalWrites > count);
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
  }
});

test('contradictory complete feedback counts cannot fabricate a deletion or authorize a reminder', async () => {
  for (const kind of ['issue', 'review']) {
    const f = fixture();
    const entries = kind === 'issue' ? f.comments : f.reviews;
    entries.push({id: 500, body: 'Still exists', user: {login: 'human', type: 'User'},
      created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
    await f.run();
    const clock = f.comments.find(comment => comment.body.startsWith(PREFIX));
    const before = clock.body, writes = f.writes.length;
    const paginate = f.github.paginate;
    const endpoint = kind === 'issue' ? f.github.rest.issues.listComments : f.github.rest.pulls.listReviewComments;
    f.github.paginate = Object.assign(async (api, args) =>
      (await paginate(api, args)).filter(comment => api !== endpoint || comment.id !== 500),
    {iterator: paginate.iterator});
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    assert.ok(entries.some(comment => comment.id === 500));
    assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time}), false);
  }
});

test('a supported meaningful event without its server time leaves the clock and checkpoint untouched', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const before = f.comments[0].body, writes = f.writes.length;
  f.events.push({event: 'labeled', actor: {login: 'human', type: 'User'}, label: {name: 'kp-conference-event'}});
  f.setTime('2026-10-28T20:00:00Z');
  await f.run();
  assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.time}), false);
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
});

test('selected clock timestamp skew cannot time a metadata change, even on repeated reads', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  const clock = f.comments[0], before = clock.body, writes = f.writes.length;
  f.pr.title = 'Renamed during the previous clock write';
  f.events.push({event: 'renamed', actor: {login: 'human', type: 'User'}, created_at: '2026-10-26T19:00:00Z'});
  f.pr.updated_at = '2026-10-26T19:00:03Z';
  f.setTime('2026-10-28T19:01:00Z');
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time};
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-25T19:00:00Z'}), null);
  }
});

test('an untimed changed head stays uncertain until reliable later activity resolves it', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.pr.head.sha = 'ordinary-push-without-trustworthy-push-time';
  f.pr.updated_at = '2026-10-28T19:01:30Z';
  f.setTime('2026-10-28T19:02:00Z');
  const clock = f.comments[0], before = clock.body, writes = f.writes.length, logs = [];
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info: message => logs.push(message)}, number: 42, now: f.time};
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:00:00Z'}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
  assert.ok(logs.some(message => /metadata changed but its time is obscured/.test(message)));
  f.humanComment();
  const genuineAt = f.comments.at(-1).updated_at;
  await f.run();
  assert.equal(readClock(clock).activityAt, genuineAt);
  assert.notEqual(clock.body, before);
});

test('unsubscribe notifications never reset activity or prevent repeated successful reviews', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const actor of ['manual-subscriber', 'github-actions[bot]', 'unrelated-bot[bot]']) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0], anchor = readClock(clock).activityAt;
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
    f.label('kp-author-stalepr', true);
    const boundary = f.pr.updated_at;
    f.events.push({event: 'unsubscribed',
      actor: {login: actor, type: actor.endsWith('[bot]') ? 'Bot' : 'User'}, created_at: boundary});
    for (const at of ['2026-10-28T20:01:00Z', '2026-10-28T21:01:00Z']) {
      f.setTime(at);
      await f.run();
      assert.equal(readClock(clock).activityAt, anchor);
      assert.equal(readClock(clock).lastReviewedAt, new Date(f.time() - 1000).toISOString());
      assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
      assert.equal(await hasActivitySince({github: f.github,
        context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
        number: 42, since: boundary, now: f.time}), false);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
    }
    f.humanComment();
    const genuineAt = f.comments.at(-1).updated_at;
    await f.run();
    assert.equal(readClock(clock).activityAt, genuineAt);
  }
});

test('unsubscribe-only timestamp contamination cannot authorize an untimed metadata reset', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  // Isolate the later unsubscribe from already acknowledged clock bookkeeping.
  f.comments[0].updated_at = readClock(f.comments[0]).observedAt;
  f.pr.head.sha = 'push-followed-by-manual-unsubscribe';
  f.pr.updated_at = '2026-10-28T20:00:03Z';
  f.events.push({event: 'unsubscribed', actor: {login: 'manual-subscriber', type: 'User'},
    created_at: '2026-10-28T20:00:01Z'});
  const before = f.comments[0].body, writes = f.writes.length, logs = [];
  f.setTime('2026-10-28T20:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info: message => logs.push(message)}, number: 42, now: f.time};
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:00:00Z'}), null);
    assert.equal(f.comments[0].body, before);
    assert.equal(f.writes.length, writes);
  }
  assert.ok(logs.some(message => /metadata changed but its time is obscured/.test(message)));
  assert.ok(logs.every(message => !message.includes('unsupported timeline event')));
});

test('actual enrollment batch skips only uncertainty and keeps genuine failures fatal', async () => {
  const fs = require('node:fs'), path = require('node:path');
  const helper = require('../scripts/kp-business-clock.cjs');
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows',
    'reusable-kp-label-event.yml'), 'utf8');
  const script = workflow.split('          script: |\n')[2]
    .split('\n').map(line => line.startsWith('            ') ? line.slice(12) : line).join('\n');
  const execute = new (Object.getPrototypeOf(async function() {}).constructor)(
    'github', 'context', 'core', 'require', script);
  for (const mode of ['new-uncertain', 'existing-uncertain', 'clock-author-uncertain',
    'issue-attribution-uncertain', 'confirmation-uncertain',
    'notification-uncertain', 'work-start-uncertain', 'owned-reminder-uncertain',
    'malformed-notification-uncertain', 'read-error', 'config-error',
    'schema-error', 'counter-schema-error', 'confirmation-api-error', 'confirmation-schema-error',
    'clock-write-error', 'membership-write-error']) {
    const first = fixture(), second = fixture();
    if (mode === 'existing-uncertain') await first.run();
    if (mode === 'clock-author-uncertain') {
      await first.run();
      delete first.comments[0].user.type;
    }
    if (mode === 'issue-attribution-uncertain') {
      await first.run();
      first.humanComment();
      const report = first.comments.at(-1);
      report.user.type = 'Bot';
      first.events.push({...structuredClone(report), event: 'commented',
        user: {...report.user, type: 'User'}});
    }
    if (mode.startsWith('confirmation-')) {
      first.comments.push({id: 500, body: 'Tracked human feedback',
        user: {login: 'human', type: 'User'}, created_at: first.pr.created_at, updated_at: first.pr.created_at});
      await first.run();
      first.comments.splice(first.comments.findIndex(item => item.id === 500), 1);
    }
    if (mode === 'malformed-notification-uncertain') {
      await first.run();
      const state = readClock(first.comments[0]);
      state.observedAt = first.comments[0].updated_at;
      first.comments[0].body = PREFIX + JSON.stringify(state) + '\n-->';
      first.events.push({event: 'mentioned', actor: {login: 'human', type: 'User'}});
      first.pr.head.sha = 'Untimed changed head';
      first.pr.updated_at = '2026-10-26T19:00:03Z';
      first.setTime('2026-10-26T20:00:00Z');
    }
    first.pr.labels = [];
    second.pr.labels = [];
    second.pr.number = 43;
    if (['new-uncertain', 'existing-uncertain'].includes(mode)) first.events.push({
      event: 'unsupported-server-event', created_at: first.pr.updated_at
    });
    if (['notification-uncertain', 'work-start-uncertain'].includes(mode)) {
      first.pr.updated_at = '2026-10-26T18:00:00Z';
      first.events.push({id: 32981713981,
        event: mode === 'notification-uncertain' ? 'subscribed' : 'copilot_work_started',
        actor: {login: 'human', type: 'User'}, created_at: first.pr.updated_at});
    }
    if (mode === 'owned-reminder-uncertain') {
      await first.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
    }
    const fixtures = new Map([[42, first], [43, second]]), reads = [], logs = [], results = [];
    const before = first.comments.map(comment => comment.body), writes = first.writes.length;
    const select = args => fixtures.get(args.issue_number ?? args.pull_number ?? args.number);
    const issues = {
      listComments() {}, listEventsForTimeline() {},
      createComment: args => {
        if (mode === 'clock-write-error') throw new Error('Clock write denied');
        return select(args).github.rest.issues.createComment(args);
      },
      updateComment: () => {throw new Error('Unexpected clock PATCH');},
      addLabels: args => {
        if (mode === 'membership-write-error') throw new Error('Membership write denied');
        return select(args).github.rest.issues.addLabels(args);
      }
    };
    const pulls = {list() {}, listReviewComments() {}, get: async args => {
      reads.push(args.pull_number);
      if (mode === 'read-error') throw new Error('Read denied');
      const response = await select(args).github.rest.pulls.get(args);
      if (mode === 'counter-schema-error') delete response.data.comments;
      return response;
    }};
    let firstCommentReads = 0;
    const paginate = async (endpoint, args) => {
      const f = select(args);
      const name = endpoint === issues.listComments ? 'listComments'
        : endpoint === issues.listEventsForTimeline ? 'listEventsForTimeline' : 'listReviewComments';
      if (f === first && mode.startsWith('confirmation-') &&
          name === 'listComments' && ++firstCommentReads === 2) {
        if (mode === 'confirmation-api-error') throw Error('Confirmation read denied');
        const snapshot = await f.github.paginate(f.github.rest.issues[name], args);
        snapshot.push({id: mode === 'confirmation-schema-error' ? 0 : 900,
          body: 'Concurrent Bot report', user: {login: 'checks', type: 'Bot'},
          created_at: first.pr.created_at, updated_at: first.pr.created_at});
        return snapshot;
      }
      return f.github.paginate(f.github.rest.issues[name], args);
    };
    paginate.iterator = async function* () {yield {data: [{number: 42}, {number: 43}]};};
    const github = {rest: {pulls, issues}, paginate, graphql: (query, args) => {
      if (mode === 'schema-error') return {repository: null};
      return select(args).github.graphql(query, {...args, number: 42});
    }};
    process.env.EVENT_NAME = 'schedule';
    if (mode === 'config-error') process.env.EVENT_LABEL = '';
    const promise = execute(github, {repo: {owner: 'test', repo: 'repo'}},
      {info: message => logs.push(message)}, name => {
        assert.ok(name.endsWith('/.github/scripts/kp-business-clock.cjs'));
        return {...helper, initialize: async args => {
          const result = await helper.initialize({...args,
            now: () => select({number: args.pr.number}).time()});
          results.push([args.pr.number, result]);
          return result;
        }};
      });
    if (mode.endsWith('uncertain')) {
      await promise;
      assert.deepEqual(first.comments.map(comment => comment.body), before, mode);
      assert.equal(first.writes.length, writes, mode);
      assert.deepEqual(first.pr.labels, [], mode);
      assert.ok(logs.some(message => /skipped without advancing/.test(message)), mode);
      assert.deepEqual(results, [[42, 'skipped'], [43, 'initialized']], mode);
      assert.ok(reads.includes(43), mode);
      assert.deepEqual(second.writes.map(([kind]) => kind), ['comment', 'add'], mode);
      assert.equal(readClock(second.comments[0]).activityAt, '2026-10-23T19:00:00Z');
      assert.deepEqual(second.pr.labels, [{name: 'kp-conference-event'}]);
    } else {
      await assert.rejects(promise, mode === 'read-error' ? /Read denied/
        : mode === 'config-error' ? /Invalid enrollment clock settings/
          : mode === 'confirmation-api-error' ? /Confirmation read denied/
            : mode === 'confirmation-schema-error' ? /Invalid persisted KP comment identities/
          : mode === 'schema-error' ? /Missing or invalid server PR edit time/
            : mode === 'counter-schema-error' ? /Invalid PR feedback count comments/ : mode === 'clock-write-error'
          ? /Clock write denied/ : /Membership write denied/);
      assert.ok(!reads.includes(43), mode);
      if (mode === 'counter-schema-error') assert.deepEqual(first.writes, []);
      assert.deepEqual(first.pr.labels, [], mode);
      assert.deepEqual(second.writes, [], mode);
    }
  }
});

test('issue timeline account attribution must agree with complete comments before every write-capable decision', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const [timelineType, currentType, login, actorOnly, id = 77] of [
    ['User', 'Bot', 'feedback-author', false], ['Bot', 'User', 'feedback-author', false],
    ['User', 'User', 'another-author', false], ['Bot', 'Bot', 'another-author', false],
    ['User', 'Bot', 'feedback-author', true], ['Bot', 'User', 'feedback-author', true],
    [undefined, 'Bot', 'feedback-author', false], ['User', undefined, 'feedback-author', false],
    ...['missing', null, '77', 1.5, 0, -1, Number.MAX_SAFE_INTEGER + 1]
      .map(value => ['User', 'Bot', 'feedback-author', false, value])
  ]) {
    for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
      const f = fixture();
      await f.run();
      const clock = f.comments[0], before = clock.body, writes = f.writes.length;
      const labels = structuredClone(f.pr.labels);
      const entry = {id: 77, body: 'Feedback report', user: {login: 'feedback-author', type: currentType},
        created_at: '2026-10-28T19:02:00Z', updated_at: '2026-10-28T19:02:00Z'};
      f.comments.push(entry);
      const event = {...structuredClone(entry), event: 'commented'};
      event.id = id;
      if (id === 'missing') delete event.id;
      event[actorOnly ? 'actor' : 'user'] = {login, type: timelineType};
      if (actorOnly) delete event.user;
      f.events.push(event);
      f.pr.updated_at = entry.updated_at;
      f.setTime('2026-10-28T19:03:00Z');
      const logs = [], args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info: message => logs.push(message)}, number: 42, now: f.github.time};
      const result = operation === 'initialize'
        ? await initialize({...args, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
          managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
        : operation === 'reconcile' ? await reconcile(args) : operation === 'posting'
          ? await postingGate(args) : await hasActivitySince({...args, since: '2026-10-28T19:01:00Z'});
      assert.equal(result, operation === 'initialize' ? 'skipped' : operation === 'reconcile'
        ? undefined : operation === 'posting' ? false : null);
      assert.ok(logs.some(message => /skipped without advancing/.test(message)));
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
      assert.deepEqual(f.pr.labels, labels);
    }
  }
});

test('matching issue timeline authors retain human edits, exclude Bot reports, and compare logins case-insensitively', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const type of ['User', 'Bot']) for (const edited of [false, true]) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0], before = clock.body, writes = f.writes.length;
    const entry = {id: 77, body: 'Original report', user: {login: 'feedback-author', type},
      created_at: '2026-10-28T19:01:00Z', updated_at: '2026-10-28T19:01:00Z'};
    f.comments.push(entry);
    f.events.push({...structuredClone(entry), event: 'commented',
      user: {login: 'FEEDBACK-AUTHOR', type}});
    if (edited) {
      entry.body = 'Legitimate permanent edit';
      entry.updated_at = '2026-10-28T19:02:00Z';
    }
    f.pr.updated_at = entry.updated_at;
    f.setTime('2026-10-28T19:03:00Z');
    assert.equal(await hasActivitySince({github: f.github,
      context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
      number: 42, since: '2026-10-28T19:00:00Z', now: f.github.time}), type === 'User');
    if (type === 'User') {
      assert.equal(readClock(clock).activityAt, entry.updated_at);
      assert.deepEqual(readClock(clock).commentIds.issue, [77]);
      assert.deepEqual(f.writes.slice(writes).map(([kind]) => kind), ['update']);
    } else {
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('historical issue timeline entries preserve confirmed human deletion and excluded deleted-Bot behavior', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const type of ['User', 'Bot']) {
    const f = fixture();
    await f.run();
    const entry = {id: 77, body: 'Historical report', user: {login: 'feedback-author', type},
      created_at: '2026-10-26T19:01:00Z', updated_at: '2026-10-26T19:01:00Z'};
    f.comments.push(entry);
    f.events.push({...structuredClone(entry), event: 'commented'});
    f.pr.updated_at = entry.updated_at;
    f.setTime('2026-10-26T19:02:00Z');
    await f.run();
    f.comments.splice(f.comments.findIndex(item => item.id === 77), 1);
    f.setTime('2026-10-28T19:03:00Z');
    const clock = f.comments[0], before = clock.body, writes = f.writes.length;
    assert.equal(await hasActivitySince({github: f.github,
      context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
      number: 42, since: '2026-10-28T19:00:00Z', now: f.github.time}), type === 'User');
    if (type === 'User') {
      assert.equal(readClock(clock).activityAt, '2026-10-28T19:03:00.000Z');
      assert.deepEqual(readClock(clock).commentIds.issue, []);
      assert.deepEqual(f.writes.slice(writes).map(([kind]) => kind), ['update']);
    } else {
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('conflicting duplicate actor/user attribution cannot re-enter through comments or inline wrappers', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const surface of ['issue', 'inline', 'line-commented', 'commented']) {
    for (const [type, actorType] of [['Bot', 'User'], ['User', 'Bot']]) {
      const f = fixture();
      await f.run();
      const entry = {id: 77, body: 'Report', user: {login: 'feedback-author', type},
        created_at: '2026-10-28T19:02:00Z', updated_at: '2026-10-28T19:02:00Z'};
      const shadowed = {...structuredClone(entry), actor: {login: 'feedback-author', type: actorType}};
      if (surface === 'issue') f.comments.push(shadowed);
      if (surface === 'inline') f.reviews.push(shadowed);
      if (surface === 'line-commented') {
        f.reviews.push(entry);
        f.events.push({event: 'line-commented', comments: [shadowed]});
      }
      if (surface === 'commented') {
        f.comments.push(entry);
        f.events.push({...shadowed, event: 'commented'});
      }
      f.pr.updated_at = entry.updated_at;
      f.setTime('2026-10-28T19:03:00Z');
      const clock = f.comments[0], before = clock.body, writes = f.writes.length;
      assert.equal(await hasActivitySince({github: f.github,
        context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
        number: 42, since: '2026-10-28T19:01:00Z', now: f.github.time}), null);
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('uncertain initial clock author types skip every entry point without writes; invalid persisted state stays fatal', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const problem of ['missing-type', 'conflicting-type', 'persisted-state']) {
    for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
      const f = fixture();
      await f.run();
      const clock = f.comments[0];
      if (problem === 'missing-type') delete clock.user.type;
      if (problem === 'conflicting-type') clock.user.__typename = 'User';
      if (problem === 'persisted-state') clock.body = PREFIX + '{}\n-->';
      const before = clock.body, writes = f.writes.length, labels = structuredClone(f.pr.labels), logs = [];
      const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info: message => logs.push(message)}, number: 42, now: f.github.time};
      const run = () => operation === 'initialize'
        ? initialize({...args, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
          managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
        : operation === 'reconcile' ? reconcile(args) : operation === 'posting'
          ? postingGate(args) : hasActivitySince({...args, since: '2026-10-20T00:00:00Z'});
      if (problem === 'persisted-state') await assert.rejects(run(), /Invalid persisted KP clock/);
      else {
        assert.equal(await run(), operation === 'initialize' ? 'skipped' : operation === 'reconcile'
          ? undefined : operation === 'posting' ? false : null);
        assert.ok(logs.some(message => /skipped without advancing/.test(message)));
      }
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
      assert.deepEqual(f.pr.labels, labels);
    }
  }
});

test('clock author uncertainty racing a valid posting checkpoint prevents later posting mutations', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const update = f.github.rest.issues.updateComment, writes = f.writes.length;
  f.github.rest.issues.updateComment = async args => {
    const response = await update(args);
    delete f.comments[0].user.type;
    return response;
  };
  assert.equal(await postingGate({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: f.github.time}), false);
  assert.deepEqual(f.writes.slice(writes).map(([kind]) => kind), ['update']);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('concurrent deletion confirmation is uncertainty for raw Bot arrivals and human identity races, with no writes or cleanup', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['issue', 'review']) {
    for (const race of ['bot-arrival', 'human-arrival', 'api-error', 'schema-error']) {
      for (const operation of ['reconcile', 'posting', 'cleanup']) {
        const f = fixture();
        const entries = kind === 'issue' ? f.comments : f.reviews;
        entries.push({id: 500, body: 'Tracked human feedback', user: {login: 'reviewer', type: 'User'},
          created_at: f.pr.created_at, updated_at: f.pr.created_at});
        await f.run();
        f.setTime('2026-10-28T19:01:00Z');
        await f.run();
        entries.splice(entries.findIndex(item => item.id === 500), 1);
        const clock = f.comments.find(item => item.body.startsWith(PREFIX));
        const before = clock.body, writes = f.writes.length, labels = structuredClone(f.pr.labels);
        const paginate = f.github.paginate;
        const endpoint = kind === 'issue' ? f.github.rest.issues.listComments : f.github.rest.pulls.listReviewComments;
        let reads = 0;
        f.github.paginate = Object.assign(async (method, args) => {
          const snapshot = await paginate(method, args);
          if (method === endpoint && ++reads === 2) {
            if (race === 'api-error') throw Error('Confirmation API denied');
            snapshot.push({id: race === 'schema-error' ? 0 : 900,
              body: 'Arrived while confirming', user: {login: 'reviewer',
                type: race === 'human-arrival' ? 'User' : 'Bot'},
              created_at: f.pr.created_at, updated_at: f.pr.created_at});
          }
          return snapshot;
        }, {iterator: paginate.iterator});
        const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: f.github.time};
        const run = () => operation === 'reconcile' ? f.run() : operation === 'posting'
          ? postingGate(args) : hasActivitySince({...args, since: '2026-10-20T00:00:00Z'});
        if (race.endsWith('error')) {
          await assert.rejects(run(), race === 'api-error'
            ? /Confirmation API denied/ : /Invalid persisted KP comment identities/);
        } else {
          const result = await run();
          assert.equal(result, operation === 'reconcile' ? undefined : operation === 'posting' ? false : null);
        }
        assert.equal(clock.body, before);
        assert.equal(f.writes.length, writes);
        assert.deepEqual(f.pr.labels, labels);
      }
    }
  }
});

test('reconciliation continues to a healthy candidate after a concurrent Bot arrival during deletion confirmation', async () => {
  const f = fixture(), healthy = fixture();
  f.comments.push({id: 500, body: 'Tracked feedback', user: {login: 'human', type: 'User'},
    created_at: f.pr.created_at, updated_at: f.pr.created_at});
  await f.run();
  f.comments.splice(f.comments.findIndex(item => item.id === 500), 1);
  const before = f.comments[0].body, writes = f.writes.length, labels = structuredClone(f.pr.labels);
  healthy.pr.number = 43;
  const firstGet = f.github.rest.pulls.get, firstPaginate = f.github.paginate, firstGraphql = f.github.graphql;
  f.github.rest.pulls.get = args => args.pull_number === 43
    ? healthy.github.rest.pulls.get(args) : firstGet(args);
  let issueReads = 0;
  f.github.paginate = Object.assign(async (method, args) => {
    if (args.issue_number === 43 || args.pull_number === 43) {
      const endpoint = method === f.github.rest.issues.listComments ? healthy.github.rest.issues.listComments
        : method === f.github.rest.pulls.listReviewComments ? healthy.github.rest.pulls.listReviewComments
          : healthy.github.rest.issues.listEventsForTimeline;
      return healthy.github.paginate(endpoint, args);
    }
    const snapshot = await firstPaginate(method, args);
    if (method === f.github.rest.issues.listComments && ++issueReads === 2) snapshot.push({
      id: 900, body: 'Concurrent Bot report', user: {login: 'checks', type: 'Bot'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at});
    return snapshot;
  }, {iterator: async function* () {yield {data: [structuredClone(f.pr), structuredClone(healthy.pr)]};}});
  f.github.graphql = (query, args) => args.number === 43
    ? healthy.github.graphql(query, {...args, number: 42}) : firstGraphql(query, args);
  const create = f.github.rest.issues.createComment;
  f.github.rest.issues.createComment = args => args.issue_number === 43
    ? healthy.github.rest.issues.createComment(args) : create(args);
  await f.run();
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
  assert.deepEqual(f.pr.labels, labels);
  assert.deepEqual(healthy.writes.map(([kind]) => kind), ['comment']);
  assert.equal(readClock(healthy.comments[0]).activityAt, healthy.pr.created_at);
});

test('first enrollment excludes every owned reminder and managed label without inventing a baseline', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['plain', 'mentioned', 'membership', 'due', 'marker']) {
    for (const independent of [false, true]) {
      const f = fixture();
      const when = f.pr.updated_at = '2026-10-26T18:00:00Z';
      if (['plain', 'mentioned'].includes(kind)) {
        f.comments.push({id: 500,
          body: (kind === 'mentioned' ? '@pr-author\n\n' : '') + process.env.AUTHOR_REMINDER_MESSAGE,
          user: {login: 'github-actions[bot]', type: 'Bot'}, created_at: when, updated_at: when});
      } else {
        const label = kind === 'membership' ? 'kp-conference-event'
          : kind === 'due' ? 'kp-reminder-due' : 'kp-author-stalepr';
        f.events.push({event: 'labeled', actor: {login: 'github-actions[bot]', type: 'Bot'},
          label: {name: label}, created_at: when});
      }
      if (independent) {
        f.comments.push({id: 501, body: 'Independently timed human feedback',
          user: {login: 'human', type: 'User'}, created_at: when, updated_at: when});
      }
      const before = structuredClone(f.comments), labels = structuredClone(f.pr.labels);
      const result = await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
        managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.github.time});
      assert.equal(result, independent ? 'initialized' : 'skipped', kind);
      if (independent) {
        assert.equal(readClock(f.comments.at(-1)).activityAt, when);
        assert.deepEqual(f.writes.map(([kind]) => kind), ['comment']);
      } else {
        assert.deepEqual(f.comments, before);
        assert.deepEqual(f.writes, []);
      }
      assert.deepEqual(f.pr.labels, labels);
    }
  }
});

test('excluded notifications require finite nonfuture server times before any metadata fallback or write', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const event of ['mentioned', 'subscribed', 'unsubscribed']) {
    for (const time of [undefined, null, '', 'not-a-time', 123, '2026-10-30T20:00:00Z']) {
      for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
        const f = fixture();
        await f.run();
        f.setTime('2026-10-26T20:00:00Z');
        await f.run();
        const clock = f.comments[0], state = readClock(clock);
        state.observedAt = clock.updated_at;
        clock.body = PREFIX + JSON.stringify(state) + '\n-->';
        const before = clock.body, writes = f.writes.length;
        const labels = structuredClone(f.pr.labels);
        f.events.push({event, actor: {login: 'human', type: 'User'}, created_at: time});
        f.pr.head.sha = 'Untimed changed head';
        f.pr.updated_at = '2026-10-26T20:00:03Z';
        f.setTime('2026-10-26T20:01:00Z');
        const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: f.github.time};
        const result = operation === 'initialize'
          ? await initialize({...args, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
            managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
          : operation === 'reconcile' ? await reconcile(args) : operation === 'posting'
            ? await postingGate(args) : await hasActivitySince({...args, since: '2026-10-26T19:00:00Z'});
        assert.equal(result, operation === 'initialize' ? 'skipped' : operation === 'reconcile'
          ? undefined : operation === 'posting' ? false : null);
        assert.equal(clock.body, before);
        assert.equal(f.writes.length, writes);
        assert.deepEqual(f.pr.labels, labels);
      }
    }
  }
});

test('excluded own and Bot records reject future timestamps and own malformed schema remains fatal', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['own-comment', 'own-label', 'bot-report']) {
    for (const problem of ['future', 'malformed']) {
      const f = fixture();
      await f.run();
      const time = problem === 'future' ? '2026-10-30T19:00:00Z' : 'not-a-time';
      if (kind === 'own-label') f.events.push({event: 'labeled', label: {name: 'kp-reminder-due'},
        actor: {login: 'github-actions[bot]', type: 'Bot'}, created_at: time});
      else f.comments.push({id: 500,
        body: kind === 'own-comment' ? process.env.AUTHOR_REMINDER_MESSAGE : 'Automated report',
        user: {login: kind === 'own-comment' ? 'github-actions[bot]' : 'checks', type: 'Bot'},
        created_at: f.pr.created_at, updated_at: time});
      const clock = f.comments[0], before = clock.body, writes = f.writes.length;
      f.setTime('2026-10-28T20:00:00Z');
      const run = () => hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, since: '2026-10-26T19:00:00Z', now: f.github.time});
      if (problem === 'malformed' && kind.startsWith('own')) await assert.rejects(run(), /Invalid KP bookkeeping time/);
      else assert.equal(await run(), null);
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
    }
  }
});

test('confirmed tracked human inline deletion survives retained wrappers and the guarded verification read', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const operation of ['initialize', 'reconcile', 'posting', 'cleanup']) {
    const f = fixture();
    const entry = {id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    f.reviews.push(entry);
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
    await f.run();
    const clock = f.comments[0];
    assert.deepEqual(readClock(clock).commentIds.review, [900]);
    f.reviews.length = 0;
    f.pr.labels.push({name: 'kp-reminder-due'});
    f.setTime('2026-10-29T20:00:00Z');
    const writes = f.writes.length, args = {github: f.github,
      context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}}, number: 42, now: f.github.time};
    if (operation === 'initialize') assert.equal(await initialize({...args,
      pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
      managedLabels: ['kp-reminder-due', 'kp-author-stalepr']}), 'initialized');
    if (operation === 'reconcile') await reconcile(args);
    if (operation === 'posting') assert.equal(await postingGate(args), false);
    if (operation === 'cleanup') assert.equal(await hasActivitySince({...args, since: '2026-10-28T20:00:00Z'}), true);
    assert.equal(readClock(clock).activityAt, '2026-10-29T20:00:00.000Z');
    assert.deepEqual(readClock(clock).commentIds.review, []);
    assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, [900]);
    assert.ok(f.writes.slice(writes).some(([kind]) => kind === 'update'));
    assert.ok(!f.writes.slice(writes).some(([kind]) => kind === 'comment' || kind === 'add'));
    for (const later of ['2026-10-29T21:00:00Z', '2026-10-30T20:00:00Z']) {
      f.setTime(later);
      await f.run();
      assert.equal(readClock(clock).activityAt, '2026-10-29T20:00:00.000Z');
      assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, [900]);
      assert.equal(readClock(clock).lastReviewedAt, new Date(later).toISOString());
      assert.equal(await postingGate(args), false);
      assert.equal(await hasActivitySince({...args, since: '2026-10-28T20:00:00Z'}), true);
      assert.equal(readClock(clock).activityAt, '2026-10-29T20:00:00.000Z');
    }
  }
});

test('confirmed inline deletion IDs do not authorize unknown old wrappers or resurrected feedback', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const problem of ['unknown-old', 'unknown-concurrent', 'human-reappeared', 'bot-reappeared', 'bot-wrapper']) {
    const f = fixture();
    const entry = {id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    f.reviews.push(entry);
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
    await f.run();
    f.reviews.length = 0;
    f.setTime('2026-10-29T20:00:00Z');
    await f.run();
    const clock = f.comments[0], saved = readClock(clock);
    assert.deepEqual(saved.confirmedDeletedReviewIds, [900]);
    if (problem.startsWith('unknown')) {
      f.events.push({event: 'line-commented', comments: [{...entry, id: 901}]});
    } else if (problem === 'bot-wrapper') {
      f.events.at(-1).comments[0].user.type = 'Bot';
    } else {
      f.reviews.push({...entry, user: {...entry.user, type: problem === 'bot-reappeared' ? 'Bot' : 'User'}});
    }
    if (problem === 'unknown-concurrent') {
      f.comments.push({id: 902, body: 'Interleaved genuine feedback', user: {login: 'human', type: 'User'},
        created_at: '2026-10-29T20:01:00Z', updated_at: '2026-10-29T20:01:00Z'});
      f.pr.updated_at = '2026-10-29T20:01:00Z';
    }
    f.setTime('2026-10-29T21:00:00Z');
    const before = clock.body, writes = f.writes.length;
    await f.run();
    assert.equal(await hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, since: '2026-10-28T20:00:00Z', now: f.github.time}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
});

test('legacy clocks establish only newly confirmed inline deletions and never infer absent history', async () => {
  for (const known of [false, true]) {
    const f = fixture();
    const entry = {id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    if (known) f.reviews.push(entry);
    await f.run();
    const clock = f.comments[0], state = readClock(clock);
    delete state.confirmedDeletedReviewIds;
    clock.body = PREFIX + JSON.stringify(state) + '\n-->';
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
    f.reviews.length = 0;
    f.setTime('2026-10-29T20:00:00Z');
    const before = clock.body, writes = f.writes.length;
    await f.run();
    if (known) {
      assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, [900]);
      assert.equal(readClock(clock).activityAt, '2026-10-29T20:00:00.000Z');
    } else {
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, writes);
      assert.equal(readClock(clock).confirmedDeletedReviewIds, undefined);
    }
  }
  const f = fixture();
  await f.run();
  const clock = f.comments[0], state = readClock(clock);
  delete state.confirmedDeletedReviewIds;
  clock.body = PREFIX + JSON.stringify(state) + '\n-->';
  f.setTime('2026-10-29T20:00:00Z');
  await f.run();
  assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, []);
  assert.equal(readClock(clock).activityAt, state.activityAt);
});

test('malformed persisted inline deletion provenance is fatal before any new writes', async () => {
  for (const value of [null, {}, '900', [0], [-1], ['900'], [1.5], [900, 900], [901, 900],
    [Number.MAX_SAFE_INTEGER + 1], [900]]) {
    const f = fixture();
    f.reviews.push({id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at});
    await f.run();
    const clock = f.comments[0], state = readClock(clock);
    state.confirmedDeletedReviewIds = value;
    clock.body = PREFIX + JSON.stringify(state) + '\n-->';
    const before = clock.body, writes = f.writes.length;
    await assert.rejects(f.run(), /Invalid persisted KP inline deletion provenance/);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
  const f = fixture();
  await f.run();
  const clock = f.comments[0], state = readClock(clock);
  delete state.feedbackPolicy;
  state.confirmedDeletedReviewIds = [900];
  clock.body = PREFIX + JSON.stringify(state) + '\n-->';
  await assert.rejects(f.run(), /Invalid persisted KP inline deletion provenance/);
});

test('Bot inline deletions never create confirmed human deletion provenance', async () => {
  const f = fixture();
  const entry = {id: 900, body: 'Bot inline report', user: {login: 'checks', type: 'Bot'},
    created_at: f.pr.created_at, updated_at: f.pr.created_at};
  f.reviews.push(entry);
  f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
  await f.run();
  const activityAt = readClock(f.comments[0]).activityAt;
  f.reviews.length = 0;
  f.setTime('2026-10-29T20:00:00Z');
  await f.run();
  assert.deepEqual(readClock(f.comments[0]).confirmedDeletedReviewIds, []);
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
});

test('new confirmed human inline deletions accumulate without losing earlier provenance or repeating resets', async () => {
  const f = fixture();
  for (const id of [901, 900]) {
    const entry = {id, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    f.reviews.push(entry);
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
  }
  await f.run();
  const clock = f.comments[0];
  for (const [id, at, ids] of [[901, '2026-10-28T20:00:00Z', [901]],
    [900, '2026-10-29T20:00:00Z', [900, 901]]]) {
    f.reviews.splice(f.reviews.findIndex(item => item.id === id), 1);
    f.setTime(at);
    await f.run();
    assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, ids);
    assert.equal(readClock(clock).activityAt, new Date(at).toISOString());
  }
  f.setTime('2026-10-30T20:00:00Z');
  await f.run();
  assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, [900, 901]);
  assert.equal(readClock(clock).activityAt, '2026-10-29T20:00:00.000Z');
});

test('failed deletion provenance saves stay fatal and never authorize cleanup', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const operation of ['reconcile', 'cleanup']) {
    const f = fixture();
    const entry = {id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    f.reviews.push(entry);
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
    await f.run();
    f.reviews.length = 0;
    f.setTime('2026-10-29T20:00:00Z');
    const clock = f.comments[0], before = clock.body, writes = f.writes.length;
    f.github.rest.issues.updateComment = async () => {throw Error('Deletion provenance save denied');};
    await assert.rejects(operation === 'reconcile' ? f.run() : hasActivitySince({github: f.github,
      context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}}, number: 42,
      since: '2026-10-28T20:00:00Z', now: f.github.time}), /Deletion provenance save denied/);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
    assert.deepEqual(readClock(clock).confirmedDeletedReviewIds, []);
  }
});

test('unexplained retained human wrappers and changing deletion snapshots still deny writes and cleanup', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const problem of ['untracked', 'legacy', 'reappeared', 'new-wrapper', 'changed-wrapper']) {
    const f = fixture();
    const entry = {id: 900, body: 'Human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: f.pr.created_at, updated_at: f.pr.created_at};
    if (problem !== 'untracked') f.reviews.push(entry);
    await f.run();
    const clock = f.comments[0];
    if (problem === 'legacy') {
      const state = readClock(clock);
      delete state.feedbackPolicy;
      delete state.confirmedDeletedReviewIds;
      clock.body = PREFIX + JSON.stringify(state) + '\n-->';
    }
    f.reviews.length = 0;
    f.events.push({event: 'line-commented', comments: [structuredClone(entry)]});
    f.setTime('2026-10-29T20:00:00Z');
    const paginate = f.github.paginate;
    let timelineReads = 0;
    f.github.paginate = Object.assign(async (endpoint, args) => {
      if (endpoint === f.github.rest.issues.listEventsForTimeline && ++timelineReads === 2) {
        if (problem === 'reappeared') f.reviews.push(entry);
        if (problem === 'new-wrapper') f.events.push({event: 'line-commented', comments: [{...entry, id: 901}]});
        if (problem === 'changed-wrapper') f.events.at(-1).comments[0].body = 'Concurrent changed wrapper';
      }
      return paginate(endpoint, args);
    }, {iterator: paginate.iterator});
    const before = clock.body, writes = f.writes.length;
    assert.equal(await hasActivitySince({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, since: '2026-10-28T20:00:00Z', now: f.github.time}), null, problem);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, writes);
  }
});

test('first enrollment cannot seed a clock from excluded human notifications or work-start bookkeeping', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const event of ['mentioned', 'subscribed', 'unsubscribed', 'copilot_work_started']) {
    for (const independent of [false, true]) {
      const f = fixture();
      f.pr.updated_at = '2026-10-26T18:00:00Z';
      f.events.push({id: 32981713981, event, actor: {login: 'requester', type: 'User'},
        created_at: f.pr.updated_at});
      if (independent) {
        f.pr.updated_at = '2026-10-26T18:01:00Z';
        f.comments.push({id: 500, body: 'Independent human feedback', user: {login: 'human', type: 'User'},
          created_at: f.pr.updated_at, updated_at: f.pr.updated_at});
      }
      const baseline = f.pr.updated_at;
      const result = await initialize({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
        managedLabels: ['kp-reminder-due', 'kp-author-stalepr'], now: f.github.time});
      assert.equal(result, independent ? 'initialized' : 'skipped', event);
      if (independent) {
        assert.equal(readClock(f.comments.find(item => item.body.startsWith(PREFIX))).activityAt, baseline);
        assert.deepEqual(f.writes.map(([kind]) => kind), ['comment']);
      } else {
        assert.deepEqual(f.writes, []);
        assert.deepEqual(f.comments, []);
      }
    }
  }
});

test('invalid API feedback counters are fatal during initialization, never successful uncertainty skips', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const field of ['comments', 'review_comments']) {
    for (const value of [undefined, null, '0', 0.5, -1, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      const f = fixture();
      const pr = structuredClone(f.pr);
      if (value === undefined) delete pr[field];
      else pr[field] = value;
      await assert.rejects(initialize({github: f.github,
        context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
        pr, eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'],
        now: f.github.time}), error => error.constructor === Error &&
          error.message.includes(`Invalid PR feedback count ${field}`), `${field}=${value}`);
      assert.deepEqual(f.writes, []);
      assert.deepEqual(f.comments, []);
      assert.deepEqual(f.pr.labels, [{name: 'kp-conference-event'}]);
    }
  }
});

test('malformed initial, guarded reread and prewrite counters fail before new clock or label writes', async () => {
  const {initialize, hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const field of ['comments', 'review_comments']) {
    for (const value of [undefined, null, '0', 0.5, -1, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      for (const [operation, brokenRead] of [
        ['initialize-reread', 1], ['reconcile', 1], ['reconcile', 2],
        ['posting', 1], ['posting', 2], ['posting', 3], ['cleanup', 1], ['cleanup', 2]
      ]) {
        const f = fixture();
        await f.run();
        f.setTime('2026-10-28T19:01:00Z');
        await f.run();
        const before = f.comments[0].body, labels = structuredClone(f.pr.labels), writes = f.writes.length;
        const get = f.github.rest.pulls.get;
        let reads = 0;
        f.github.rest.pulls.get = async args => {
          const response = await get(args);
          if (++reads === brokenRead) {
            if (value === undefined) delete response.data[field];
            else response.data[field] = value;
          }
          return response;
        };
        const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: f.github.time};
        const promise = operation === 'initialize-reread'
          ? initialize({...args, pr: structuredClone(f.pr), eventLabel: 'kp-conference-event',
            managedLabels: ['kp-reminder-due', 'kp-author-stalepr']})
          : operation === 'reconcile' ? f.run() : operation === 'posting' ? postingGate(args)
            : hasActivitySince({...args, since: '2026-10-20T00:00:00Z'});
        await assert.rejects(promise, error => error.constructor === Error &&
          error.message.includes(`Invalid PR feedback count ${field}`),
        `${operation}/read${brokenRead}/${field}=${value}`);
        assert.equal(f.writes.length, writes);
        assert.equal(f.comments[0].body, before);
        assert.deepEqual(f.pr.labels, labels);
      }
    }
  }
});

test('malformed post-bookkeeping rereads fail fatally without any subsequent mutations', async () => {
  for (const field of ['comments', 'review_comments']) {
    for (const value of [undefined, null, '0', 0.5, -1, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      for (const brokenRead of [4, 5]) {
        const f = fixture();
        await f.run();
        f.setTime('2026-10-28T19:01:00Z');
        await f.run();
        const get = f.github.rest.pulls.get, writes = f.writes.length, labels = structuredClone(f.pr.labels);
        let reads = 0, afterMalformed;
        f.github.rest.pulls.get = async args => {
          const response = await get(args);
          if (++reads === brokenRead) {
            afterMalformed = f.writes.length;
            if (value === undefined) delete response.data[field];
            else response.data[field] = value;
          }
          return response;
        };
        await assert.rejects(postingGate({github: f.github,
          context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
          number: 42, now: f.github.time}), error => error.constructor === Error &&
            error.message.includes(`Invalid PR feedback count ${field}`));
        assert.equal(f.writes.length, afterMalformed, 'no mutation after invalid response');
        assert.deepEqual(f.writes.slice(writes).map(([kind]) => kind), ['update'],
          'only the checkpoint saved before the later malformed response');
        assert.deepEqual(f.pr.labels, labels);
      }
    }
  }
});

test('valid nonnegative counter disagreements still skip uncertain enrollment without writes', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  for (const field of ['comments', 'review_comments']) {
    for (const reread of [false, true]) {
      const f = fixture(), logs = [];
      const pr = structuredClone(f.pr);
      if (reread) {
        const get = f.github.rest.pulls.get;
        f.github.rest.pulls.get = async args => {
          const response = await get(args);
          response.data[field]++;
          return response;
        };
      } else pr[field]++;
      assert.equal(await initialize({github: f.github,
        context: {repo: {owner: 'test', repo: 'repo'}}, core: {info: message => logs.push(message)},
        pr, eventLabel: 'kp-conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr'],
        now: f.github.time}), 'skipped');
      assert.ok(logs.some(message => /skipped without advancing/.test(message)));
      assert.deepEqual(f.writes, []);
      assert.deepEqual(f.comments, []);
    }
  }
});

test('pinned stock cleanup retains uncertain markers, persists genuine activity and fails genuine errors', async () => {
  const fs = require('node:fs'), path = require('node:path');
  const {createHash} = require('node:crypto');
  const helper = require('../scripts/kp-business-clock.cjs');
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows',
    'reusable-kp-reminder.yml'), 'utf8');
  const injection = workflow.match(/\.replace\(marker, marker \+ ("(?:[^"\\]|\\.)*")\)/);
  assert.ok(injection);
  assert.ok(workflow.includes('.replace(cleanup, "kpActivitySinceMarker &&")'));
  // Exact removal branch from actions/stale at 4391f3da665fdf50b6810c1a66712fb9ba21aa93.
  const branch = [
    '        if (shouldRemoveStaleWhenUpdated &&',
    '            (issueHasUpdateSinceStale || issueHasCommentsSinceStale) &&',
    '            !issue.markedStaleThisRun) {',
    '            issueLogger.info(`Remove the stale label since the $$type has been updated and the workflow should remove the stale label when updated`);',
    '            await this._removeStaleLabel(issue, staleLabel);',
    '            // Are there labels to remove or add when an issue is no longer stale?',
    '            await this._removeLabelsOnStatusTransition(issue, labelsToRemoveWhenUnstale, Option.LabelsToRemoveWhenUnstale);',
    '            await this._addLabelsWhenUnstale(issue, labelsToAddWhenUnstale);',
    '            issueLogger.info(`Skipping the process since the $$type is now un-stale`);',
    '            return; // Nothing to do because it is no longer stale',
    '        }'
  ].join('\n');
  assert.equal(createHash('sha256').update(branch).digest('hex'),
    'db8224885b8106ea18d7c0c8fb012b6587150677d877b1d80cbba5aa53d9dbb8');
  const execute = new (Object.getPrototypeOf(async function() {}).constructor)(
    'issue', 'creationDate', 'issueLogger', 'process', '__WEBPACK_EXTERNAL_createRequire',
    'github_context', 'Option',
    JSON.parse(injection[1]).replaceAll('import.meta.url', '"file:///fixture.js"') +
    '\nconst shouldRemoveStaleWhenUpdated = true, issueHasUpdateSinceStale = true, issueHasCommentsSinceStale = false;' +
    '\nconst staleLabel = "kp-author-stalepr", labelsToRemoveWhenUnstale = [], labelsToAddWhenUnstale = [];\n' +
    branch.replace('(issueHasUpdateSinceStale || issueHasCommentsSinceStale) &&', 'kpActivitySinceMarker &&'));
  for (const problem of ['missing-clock', 'late-feedback', 'none', 'save', 'api', 'persisted']) {
    const failSave = problem === 'save';
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:00:00Z');
    await f.run();
    await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
    f.label('kp-author-stalepr', true);
    const markerAt = f.pr.updated_at;
    f.setTime('2026-10-28T20:00:00Z');
    await f.run();
    const clock = f.comments[0], count = f.writes.length;
    if (problem === 'late-feedback') {
      f.comments.push({id: 900, body: 'Late human feedback', user: {login: 'human', type: 'User'},
        created_at: '2026-10-28T18:50:00Z', updated_at: '2026-10-28T18:50:00Z'});
    } else {
      f.pr.title = 'Genuine rename after reconciliation';
      f.pr.updated_at = '2026-10-28T20:01:00Z';
      f.events.push({event: 'renamed', actor: {login: 'human', type: 'User'}, created_at: f.pr.updated_at});
    }
    f.setTime('2026-10-28T20:02:00Z');
    if (failSave) f.github.rest.issues.updateComment = async () => {throw new Error('Clock PATCH denied');};
    if (problem === 'missing-clock') f.comments.splice(0, 1);
    if (problem === 'api') f.github.rest.pulls.get = async () => {throw Error('PR access denied');};
    if (problem === 'persisted') clock.body = PREFIX + '{}\n-->';
    const before = clock.body;
    let removed = 0;
    const stock = {client: f.github,
      _removeStaleLabel: async (pr, name) => {
        assert.equal(readClock(clock).activityAt, '2026-10-28T20:01:00Z');
        assert.equal(readClock(clock).lastReviewedAt, '2026-10-28T20:02:00.000Z');
        await f.github.rest.issues.removeLabel({name});
        removed++;
      },
      _removeLabelsOnStatusTransition: async () => {},
      _addLabelsWhenUnstale: async () => {}};
    const fakeProcess = {env: {GITHUB_WORKSPACE: path.join(__dirname, '..', '..')}};
    const load = name => name === 'node:path' ? path : {
      hasActivitySince: args => helper.hasActivitySince({...args, now: f.time})
    };
    const promise = execute.call(stock, {...f.pr, isPullRequest: true}, markerAt, {info() {}},
      fakeProcess, () => load, {repo: {owner: 'test', repo: 'repo'}}, {});
    if (['save', 'api', 'persisted'].includes(problem)) {
      await assert.rejects(promise, failSave ? /Clock PATCH denied/
        : problem === 'api' ? /PR access denied/ : /Invalid persisted KP clock/);
      assert.equal(fakeProcess.exitCode, 1);
      assert.equal(removed, 0);
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, count);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
    } else if (['missing-clock', 'late-feedback'].includes(problem)) {
      await promise;
      assert.equal(fakeProcess.exitCode, undefined);
      assert.equal(removed, 0);
      assert.equal(clock.body, before);
      assert.equal(f.writes.length, count);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
    } else {
      await promise;
      assert.equal(removed, 1);
      assert.deepEqual(f.writes.slice(count).map(([kind]) => kind), ['update', 'remove']);
      assert.equal(readClock(clock).fingerprint,
        helper.fingerprint(f.pr, ['kp-reminder-due', 'kp-author-stalepr'], 'kp-conference-event'));
      assert.deepEqual(readClock(clock).commentIds, {issue: [], review: []});
      f.setTime('2026-10-28T21:00:00Z');
      await f.run();
      assert.equal(readClock(clock).activityAt, '2026-10-28T20:01:00Z');
      assert.equal(readClock(clock).lastReviewedAt, '2026-10-28T21:00:00.000Z');
    }
  }
});

test('actual owned cleanup injection ignores non-PR stale issues before requesting pull-request clock activity', async () => {
  const fs = require('node:fs'), path = require('node:path');
  const workflow = fs.readFileSync(path.join(__dirname, '..', 'workflows', 'reusable-kp-reminder.yml'), 'utf8');
  const injection = workflow.match(/\.replace\(marker, marker \+ ("(?:[^"\\]|\\.)*")\)/);
  assert.ok(injection);
  const run = new (Object.getPrototypeOf(async function() {}).constructor)(
    'issue', 'creationDate', 'issueLogger', 'process', '__WEBPACK_EXTERNAL_createRequire', 'github_context',
    JSON.parse(injection[1]).replaceAll('import.meta.url', '"file:///fixture.js"'));
  const calls = [];
  const load = name => name === 'node:path' ? path : {hasActivitySince: async args => {
    calls.push(args.number);
    if (args.number === 77) throw Error('A non-PR issue would produce a pull-request404');
    return null;
  }};
  const process = {env: {GITHUB_WORKSPACE: '.'}};
  await run.call({client: {}}, {number: 77, isPullRequest: false}, '2026-10-28T19:00:00Z',
    {info() {}}, process, () => load, {repo: {owner: 'test', repo: 'repo'}});
  assert.deepEqual(calls, []);
  assert.equal(process.exitCode, undefined);
  await run.call({client: {}}, {number: 42, isPullRequest: true}, '2026-10-28T19:00:00Z',
    {info() {}}, process, () => load, {repo: {owner: 'test', repo: 'repo'}});
  assert.deepEqual(calls, [42], 'the real PR still reaches the owned cleanup guard');
});

test('negative cleanup reviews do not write a gratuitous checkpoint', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  const before = f.comments[0].body, writes = f.writes.length;
  f.setTime('2026-10-28T20:00:00Z');
  assert.equal(await hasActivitySince({github: f.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, since: '2026-10-28T19:00:00Z', now: f.time}), false);
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
});

test('documented inline timeline containers use complete independently timed feedback, not wrapper time', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const kind of ['complete', 'count-missing', 'same-count-different-id', 'body-mismatch',
    'actor-mismatch', 'time-mismatch', 'untimed', 'malformed', 'empty', 'null-entry', 'unrelated-unknown']) {
    const f = fixture();
    await f.run();
    const clock = f.comments[0], before = clock.body, count = f.writes.length;
    const inline = {id: 901, body: 'Actual human inline feedback', user: {login: 'reviewer', type: 'User'},
      created_at: '2026-10-27T20:00:00Z', updated_at: '2026-10-27T20:00:00Z'};
    f.reviews.push(structuredClone(inline));
    const wrapper = {event: 'line-commented', node_id: 'wrapper-node', comments: [structuredClone(inline)]};
    if (kind === 'count-missing') {f.reviews.length = 0; f.pr.review_comments = 1;}
    if (kind === 'same-count-different-id') f.reviews[0].id = 902;
    if (kind === 'body-mismatch') f.reviews[0].body = 'Different independently read revision';
    if (kind === 'actor-mismatch') f.reviews[0].user.login = 'different-reviewer';
    if (kind === 'time-mismatch') f.reviews[0].updated_at = '2026-10-27T19:59:59Z';
    if (kind === 'untimed') {
      for (const item of [f.reviews[0], wrapper.comments[0]]) {
        delete item.created_at;
        delete item.updated_at;
      }
    }
    if (kind === 'malformed') delete wrapper.comments;
    if (kind === 'empty') wrapper.comments = [];
    if (kind === 'null-entry') wrapper.comments = [null];
    if (kind === 'unrelated-unknown') f.events.push({event: 'unknown-meaningful-event'});
    f.events.push(wrapper);
    f.pr.updated_at = inline.updated_at;
    f.setTime('2026-10-28T20:00:00Z');
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time};
    for (let retry = 0; retry < 2; retry++) {
      await f.run();
      if (kind === 'complete') {
        assert.equal(readClock(clock).activityAt, inline.updated_at);
        assert.deepEqual(readClock(clock).commentIds.review, [901]);
        assert.equal(await hasActivitySince({...args, since: '2026-10-27T19:00:00Z'}), true);
      } else {
        assert.equal(await postingGate(args), false, kind);
        assert.equal(await hasActivitySince({...args, since: '2026-10-27T19:00:00Z'}), null, kind);
        assert.equal(clock.body, before, kind);
        assert.equal(f.writes.length, count, kind);
      }
    }
  }
});

test('inline wrapper account types must agree symmetrically before activity or cleanup is accepted', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const [wrapperType, currentType] of [['User', 'Bot'], ['Bot', 'User'], ['User', 'User'], ['Bot', 'Bot']]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    f.label('kp-author-stalepr', true);
    const clock = f.comments[0], before = clock.body, baseline = readClock(clock).activityAt;
    const labels = structuredClone(f.pr.labels), writes = f.writes.length;
    const at = '2026-10-28T19:02:00Z';
    const inline = {id: 901, body: 'Same feedback in both complete snapshots',
      user: {login: 'reviewer', type: currentType}, created_at: at, updated_at: at};
    f.reviews.push(inline);
    const nested = structuredClone(inline);
    nested.user.type = wrapperType;
    f.events.push({event: 'line-commented', comments: [nested]});
    f.pr.updated_at = at;
    f.setTime('2026-10-28T19:03:00Z');
    await f.run();
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.github.time};
    if (wrapperType !== currentType) {
      assert.equal(clock.body, before);
      assert.equal(await postingGate(args), false);
      assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:01:00Z'}), null);
      assert.equal(f.writes.length, writes);
      assert.deepEqual(f.pr.labels, labels);
      assert.equal(clock.body, before);
    } else {
      assert.equal(readClock(clock).activityAt, currentType === 'User' ? at : baseline);
      assert.deepEqual(readClock(clock).commentIds.review, currentType === 'User' ? [901] : []);
      assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:01:00Z'}),
        currentType === 'User');
    }
  }
});

test('exact old and recent Copilot work-start events preserve activity and markers for every actor', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const actor of ['human-requester', 'github-actions[bot]', 'copilot-pull-request-reviewer[bot]']) {
    for (const at of ['2026-10-11T10:41:12Z', '2026-10-28T19:02:00Z']) {
      const f = fixture();
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
      f.label('kp-author-stalepr', true);
      const markerAt = f.pr.updated_at, clock = f.comments[0], activityAt = readClock(clock).activityAt;
      f.events.push({id: 32981713981, event: 'copilot_work_started',
        actor: {login: actor, type: actor.endsWith('[bot]') ? 'Bot' : 'User'},
        created_at: at, performed_via_github_app: {slug: 'copilot-pull-request-reviewer'}});
      f.setTime('2026-10-28T20:00:00Z');
      f.pr.updated_at = '2026-10-28T19:02:00Z';
      for (let retry = 0; retry < 2; retry++) {
        await f.run();
        assert.equal(readClock(clock).activityAt, activityAt);
        assert.match(clock.body, /3 day clock started on 2026-10-23 12:00:00 PDT \(UTC-07:00\)$/);
        const writes = f.writes.length;
        assert.equal(await hasActivitySince({github: f.github,
          context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
          number: 42, since: markerAt, now: f.time}), false);
        assert.equal(f.writes.length, writes);
        assert.ok(f.pr.labels.some(label => label.name === 'kp-author-stalepr'));
        f.setTime('2026-10-28T21:00:00Z');
      }
      f.humanComment();
      const genuineAt = f.comments.at(-1).updated_at;
      await f.run();
      assert.equal(readClock(clock).activityAt, genuineAt);
    }
  }
});

test('a work-start event cannot supply the timestamp for an untimed changed head', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  await f.run();
  f.comments[0].updated_at = readClock(f.comments[0]).observedAt;
  const clock = f.comments[0], before = clock.body, count = f.writes.length;
  f.pr.head.sha = 'push-followed-by-review-job-start';
  f.pr.updated_at = '2026-10-28T19:01:03Z';
  f.events.push({id: 32981713981, event: 'copilot_work_started', actor: {login: 'human-requester', type: 'User'},
    created_at: '2026-10-28T19:01:00Z',
    performed_via_github_app: {slug: 'copilot-pull-request-reviewer'}});
  f.setTime('2026-10-28T20:00:00Z');
  const args = {github: f.github,
    context: {repo: {owner: 'test', repo: 'repo'}}, core: {info() {}},
    number: 42, now: f.time};
  for (let retry = 0; retry < 2; retry++) {
    await f.run();
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-28T19:00:00Z'}), null);
    assert.equal(clock.body, before);
    assert.equal(f.writes.length, count);
  }
  f.humanComment();
  const genuineAt = f.comments.at(-1).updated_at;
  await f.run();
  assert.equal(readClock(clock).activityAt, genuineAt);
});

test('missing or invalid work-start server identity/time remains uncertain', async () => {
  const {hasActivitySince} = require('../scripts/kp-business-clock.cjs');
  for (const change of [{created_at: undefined}, {created_at: 'not-a-server-time'},
    {created_at: '2027-01-01T00:00:00Z'}, {id: undefined}, {id: 0}]) {
    const f = fixture();
    await f.run();
    const before = f.comments[0].body, writes = f.writes.length;
    f.events.push({id: 32981713981, event: 'copilot_work_started', actor: {login: 'human', type: 'User'},
      created_at: '2026-10-11T10:41:12Z', ...change});
    f.setTime('2026-10-28T20:00:00Z');
    await f.run();
    const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: f.time};
    assert.equal(await postingGate(args), false);
    assert.equal(await hasActivitySince({...args, since: '2026-10-27T19:00:00Z'}), null);
    assert.equal(f.comments[0].body, before);
    assert.equal(f.writes.length, writes);
  }
});

test('separate all-Bot policy excludes reviewer-app feedback but work-start policy does not exempt unknown human events', async () => {
  const f = fixture();
  await f.run();
  f.comments.push({id: 901, body: 'Actual review feedback from the same application',
    user: {login: 'copilot-pull-request-reviewer[bot]', type: 'Bot'},
    created_at: '2026-10-27T19:00:00Z', updated_at: '2026-10-27T19:00:00Z'});
  f.pr.updated_at = '2026-10-27T19:00:00Z';
  f.setTime('2026-10-28T20:00:00Z');
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  f.humanComment();
  const humanAt = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, humanAt);
  const before = f.comments[0].body, writes = f.writes.length;
  f.events.push({id: 32981713982, event: 'copilot_work_finished', actor: {login: 'human', type: 'User'},
    created_at: '2026-10-27T20:00:00Z'});
  await f.run();
  assert.equal(f.comments[0].body, before);
  assert.equal(f.writes.length, writes);
});

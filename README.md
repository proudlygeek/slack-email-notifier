# :mailbox_with_mail: Slack Email Notifier #

Sends a message in a Slack channel of your choice when receiving an email.
Supports attachment upload on Slack. 

Instructions
------------

1. Configure DNS records (MX, A) for your SMTP server (see [here][1] for tips) subdomain;
2. Copy *slack.env.template* into *slack.env* and replace the keys values:

```
VIRTUAL_HOST=mxsubdomain.domain.com
SLACK_AUTH_TOKEN=[generate one here][2]
SLACK_POST_HOOK=[your webhook URL][3]
```

3. Run the app with **npm start** (I personally use it in a Docker container behind [HAProxy][4]) 

[1]: http://mailin.io/doc
[2]: https://api.slack.com/tokens
[3]: https://travel-tips.slack.com/services/new/incoming-webhook
[4]: http://www.haproxy.org/

4. Start sending emails to your subdomains; you can also send an attachment like a picture.
5. Profit :dollar: :dollar: :dollar: 
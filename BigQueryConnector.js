const { BigQuery } = require("@google-cloud/bigquery");

class BigQueryConnector {
    constructor() {
        this.client = new BigQuery({
            keyFilename: process.env.GOOGLE_SERVICE_KEY,
            projectId: process.env.GOOGLE_PROJECT_ID,
        });
    }
    async executeQuery(selectFieldName, datasetName, tableName, whereClause) {

        const queryStatement = `SELECT ${selectFieldName} FROM \`${datasetName}.${tableName}\` WHERE ${whereClause}`;

        try {
            const rows = await this.client.query({
                query: queryStatement,
            });
            return rows[0];
        } catch (err) {
            return undefined;
        }

    }

    async getGcnInspirationData() {
        const sql = 'SELECT posts.text, Likes \
    FROM `flanders-raw-production.socialmedia_insights.postanalyticsstats` as stats \
    INNER JOIN `flanders-raw-production.socialmedia_insights.posts` as posts ON stats.post = posts.id \
    CROSS JOIN UNNEST(posts.tags) as tags \
    WHERE tags = "gcninspiration" \
    ORDER BY Likes DESC LIMIT 300';

        try {
            const rows = await this.client.query({
                query: sql,
            });
            return rows[0];
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
}

module.exports = new BigQueryConnector();
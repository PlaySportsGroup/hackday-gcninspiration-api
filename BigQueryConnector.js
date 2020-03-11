const { BigQuery } = require("@google-cloud/bigquery");
const NodeCache = require("node-cache");
const dataCache = new NodeCache();

class BigQueryConnector {
    constructor() {
        this.client = new BigQuery({
            keyFilename: process.env.GOOGLE_SERVICE_KEY,
            projectId: process.env.GOOGLE_PROJECT_ID,
        });

        this.englishAccounts = [
            '5a9d11fe7f2cbb0b2680c5fd',
            '5a3a38f99b0e096ef8dff694',
            '598c4ca6d4c16444c1ef7f04',
            '5a3a39e09b0e096ef8dff698',
            '598c4cabd4c16444c1ef8271',
            '598c4cabd4c16444c1ef8251',
            '598c4cabd4c16444c1ef8255',
            '5a3a38f99b0e096ef8dff692',
            '598c4ca6d4c16444c1ef7f08',
            '5a3a397cfa1fee6ef2651759',
            '5d1c857847d03fe219a7f64a',
            '598c4cabd4c16444c1ef8275',
            '5a3a39e09b0e096ef8dff69a',
            '598c4cabd4c16444c1ef8253',
            '598c4cabd4c16444c1ef8273',
            '5a3a397cfa1fee6ef265175a',
            '5a3a39e09b0e096ef8dff697',
            '5aeb3fdac5d05a774af54158',
            '5a3a38f99b0e096ef8dff695',
            '598c4ca6d4c16444c1ef7f06',
            '5a96dd4b4f105a5d10e099e8',
            '5a96dd2a664d875d160d6bf4',
            '5a96dd75664d875d160d6bf5',
            '5a96dcdd664d875d160d6bf3',
            '5a96df0c664d875d160d6bf6',
            '5a96e5a0664d875d160d6bf7'
        ]
    }

    async setCache(key, data) {
        return dataCache.set(key, data, 10000);
    }

    async getCache(key) {
        return await dataCache.get(key);
    }

    combine_ids(ids) {
        return (ids.length ? "'" + ids.join("','") + "'" : "");
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

    async getGcnInspirationData(random) {

        const data = await this.getCache('posts');
        if (data) {
            if (!random) {
                return data;
            }
            return this.shuffle(data);
        }
        const whereIn = this.combine_ids(this.englishAccounts);
        const sql = 'SELECT posts.text, Likes, posts.type, publishedAt, posts.thumbnail_url \
                    FROM `flanders-raw-production.socialmedia_insights.postanalyticsstats` as stats \
                    INNER JOIN `flanders-raw-production.socialmedia_insights.posts` as posts ON stats.post = posts.id \
                    CROSS JOIN UNNEST(posts.tags) as tags \
                    WHERE tags = "gcninspiration" and stats.account IN \
                    (' + whereIn + ') ORDER BY Likes DESC LIMIT 1000';

        try {
            const rows = await this.client.query({
                query: sql,
            });
            this.setCache('posts', rows[0]);
            return rows[0];
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


}

module.exports = new BigQueryConnector();
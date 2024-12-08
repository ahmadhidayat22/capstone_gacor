import axios from 'axios';
import News from '../models/NewsModel.js';
import { Op } from 'sequelize';

export const fetchNews = async (req, res) => {
    try {
        const response = await axios.get('http://api.mediastack.com/v1/news', {
            params: {
                access_key: process.env.MEDIASTACK_ACCESS_KEY,
                categories: 'health',
                countries: 'us,gb',
            }
        });
        const newsData = response.data.data;
        const filteredNewsData = newsData.filter(news => news.image);
        const randomNewsData = filteredNewsData.sort(() => Math.random() - 0.5); 

        //nyalakan jika belum ada data tersimapan didatabase
        // for (const news of filteredNewsData) {
        //     await News.create({
        //         title: news.title,
        //         description: news.description,
        //         source: news.source,
        //         date_published: news.published_at,
        //         url: news.url,
        //         image: news.image,
        //         category: news.category
        //     });
        // }


        return res.status(200).json(randomNewsData);

    } catch (error) {
        console.error('Error fetching news from API:', error.message);
        try {
            const backupNews = await News.findAll({ 
                where: { 
                    category: 'health', 
                    image: { [Op.ne]: null } 
                },
                limit: 10
            });

            if (backupNews.length > 0) {
                const randomBackupNews = backupNews.sort(() => Math.random() - 0.5);
                return res.status(200).json({
                    message: 'API gagal, data cadangan diambil dari database.',
                    data: randomBackupNews
                });
            } else {
                return res.status(404).json({ message: 'Tidak ada data cadangan di database.' });
            }
        } catch (dbError) {
            console.error('Error fetching backup data from database:', dbError.message);
            return res.status(500).json({ message: 'Gagal mengambil data cadangan dari database.', error: dbError.message });
        }
    }
};

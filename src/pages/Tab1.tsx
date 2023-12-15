
import React, { useState, useEffect} from 'react';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg, 
} from '@ionic/react';

//declare let cordova: any;
/*
interface Window {
  cordova: any;
}

*/

declare var cordova: any;


//import axios, { AxiosResponse } from 'axios';

interface Article {
  ID: string;
  post_title: string;
  acf?: {
    color: string;
    weight: string;
    lifespan: string;
    image: string;
  };
}

const Tab1: React.FC = () => {
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://dev-cs55final.pantheonsite.io/wp-json/2023-child/v1/special';

      console.log('Fetching data from:', url);

      if ((window as any).cordova)  {
        cordova.plugin.http.get(url, {}, {}, 
          function(response: any) {
            console.log('Response received:', response);
            const responseData = JSON.parse(response.data); 
            const filteredArticles = responseData.filter((article: Article) => article.acf && article.acf.lifespan);
            setArticles(filteredArticles);
            //setArticles(responseData); 
            setIsLoading(false);
          },
          function(response: any) {
            console.error('HTTP error status:', response.status);
            console.error('HTTP error:', response.error);
            setError(new Error('Failed to fetch articles'));
            setIsLoading(false);
          }
        );
      } else {
        console.error("Cordova not available.");
        setError(new Error("Cordova not available"));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (

    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Articles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {articles.map(article => (
          <IonCard key={article.ID}>
            {article.acf && article.acf.image && (
              <IonImg src={article.acf.image} />
            )}
            <IonCardHeader>
              <IonCardTitle>{article.post_title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {article.acf && (
                <>
                  <p>Color: {article.acf.color}</p>
                  <p>Weight: {article.acf.weight}</p>
                  <p>Lifespan: {article.acf.lifespan}</p>
                </>
              )}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
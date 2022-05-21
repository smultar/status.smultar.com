import { Service } from '../components/service.jsx';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';


const Main = () => {

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const fetchServices = async () => {

    const request = await fetch('/api/services');
    const response = await request.json();

    setServices([...response.services]); setRefresh(1);
  }

  useEffect(() => {
      
    setTimeout(() => {
      fetchServices();
    }, 2 * 1000);

    setInterval(() => {
      fetchServices();
    }, 30 * 1000);

  }, []);

  useEffect(() => {
    const interval = setInterval(() => setRefresh((time) => time + 1),1 * 1000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className='page'>
      <Head>
        <title>Status | Smultar</title>
        <meta key='description' name="description" content="Supporting mods creators around the globe." />
        <meta key='keywords' name="keywords" content="Smultar, Games, Aether Link, Aether, Final Fantasy, Services, Free, Quality, Patreon, Prometheus, Blender"/>
        <meta key='theme' name="theme-color" content="#B83200"/>
        <meta key='lang' name="language" content="English"/>
        <meta key='author' name="author" content="Smultar"/>
        <meta key='sitename' property="og:site_name" content="Smultar" />
        <link rel="icon" href="/svgs/smultar.svg" />
        <meta key='ogTitle' property="og:title" content="Performance Report | Smultar"/>
        <meta key='ogDescription'property="og:description" content="Performance at a glance, letting you know whats up with my network."/>
        <meta key='ogImage' property="og:image" content="http://status.smultar.com/img/og/og.png"/>
        <meta key='ogImageSecured'property="og:image:secure_url" content="https://status.smultar.com/img/og/og.png"/>
        <meta key='ogImageType' property="og:image:type" content="image/png"></meta>
      </Head>

      <div className='page-content'>
            <div className='grid'>
              <div className='top'>
                <img src='/svgs/smultar.svg' layout='responsive' onClick={() => {Fetch()}}></img>
                <div className='text-fields'>
                  <p className='title'>smultar status</p>
                  <p className='subtitle'>performance at a glance <span>V{process.env.VERSION} build ({process.env.BUILD})</span></p>
                  { services.length == 0 && 
                    <p className='refresh'>Its been <span>{refresh}</span> second{(refresh > 1) ? 's': ''} ago</p>
                  }
                  { services.length >= 1 && 
                    <p className='refresh'>Last refresh was <span>{refresh}</span> second{(refresh > 1) ? 's': ''} ago</p>
                  }
                </div>
              </div>

              <div className='services'>
                { services.length == 0 && 
                  <p className='loading'><img src='/svgs/loading.svg'></img>Contacting Enceladus Network</p>
                }
                { services.length >= 1 && 
                  services.map((service, index) => {
                      return (
                        <Service key={index} name={service.name} image={service.image} status={service.status} sub={service.sub} index={index} selected={(selected == index)} select={() => {(selected == index) ? setSelected(null) : setSelected(index)}}/>
                      )
                    }
                  )
                }
              </div>

              { services.length >= 1 && 
                <p className='info'>This is a general overview of all of my services, to see more information on a per cluster/service basis by clicking on it instead.</p>
              }
              
              <div className='fade'></div>

            </div>
              <div className='footer'>
                <p>Feel like something is broken? Contact <Link href="https://discord.gg/pBHJU7c"><span>Smultar</span></Link></p>
              </div>
        </div>

    </div>
  )
};

export default dynamic(() => Promise.resolve(Main), { ssr: false });

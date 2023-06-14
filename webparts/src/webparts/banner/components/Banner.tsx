// tslint:disable:max-line-length
import { sp } from '@pnp/sp';
import '@pnp/sp/items';
import '@pnp/sp/lists';
import { IRenderListDataParameters } from '@pnp/sp/lists';
import '@pnp/sp/search';
import '@pnp/sp/webs';
import * as React from 'react';
import { IBannerItem, IBannerProps, ITrackModel } from './IBannerProps';
import { FunctionComponent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import SwiperCore, { Autoplay, Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import { Shared } from './Shared';
import { IContextProps } from './Entities';
import { Context } from './Context';
SwiperCore.use([Thumbs, Autoplay, Navigation]);

export const Banner: FunctionComponent<IBannerProps> = (props: PropsWithChildren<IBannerProps>) => {
  const [bannerItems, setBannerItems] = useState([] as IBannerItem[]);
  //const [swiper, updateSwiper] = useState(undefined);
  const urlCode: string = typeof props.urlCode !== 'undefined' ? `?sc=${props.urlCode}` : '';
  const sharedCode: string = typeof props.sharedCode !== 'undefined' ? `?sc=${props.sharedCode}` : '';
  const context: IContextProps = React.useContext(Context);

  /*if (Shared.isEditMode(props.displayMode)) {
    return <></>;
  }*/

  useEffect(() => {
    const date: Date = new Date();
    const dateISO: string = date.toISOString();
    const renderListDataParams: IRenderListDataParameters = {
      ViewXml: `<View>
      <Query>
        <RowLimit>15</RowLimit>
        <Where>
          <And>
            <IsNotNull>
              <FieldRef Name='Order' />
            </IsNotNull>
            <And>
              <Geq>
              <FieldRef Name='HighlightEndDate' />
                <Value Type='DateTime' IncludeTimeValue='true'>${dateISO}</Value>
              </Geq>
              <Leq>
              <FieldRef Name='HighlightStartDate' />
                <Value Type='DateTime' IncludeTimeValue='true'>${dateISO}</Value>
              </Leq>
            </And>
          </And>
        </Where>
        <OrderBy>
          <FieldRef Name='Order' Ascending='True' />
        </OrderBy>
      </Query>
      <ViewFields>
        <FieldRef Name='ID' />
        <FieldRef Name='Title' />
        <FieldRef Name='Link' />
        <FieldRef Name='Lead' />
        <FieldRef Name='Tags' />
        <FieldRef Name='CategoryName' />
        <FieldRef Name='ThumbnailImage' />
        <FieldRef Name='PublicationDate' />
        <FieldRef Name='ContentTypeName' />
        <FieldRef Name='Order' />
        <FieldRef Name='HighlightStartDate' />
        <FieldRef Name='HighlightEndDate' />
      </ViewFields>
    </View>`
    };

    sp.site.rootWeb
      .getList(`${context.wpContext.pageContext.site.serverRelativeUrl}Lists/HighlightsManagement`)
      .renderListDataAsStream(renderListDataParams)
      .then((spItems) => {
        if (spItems.Row.length) {
          console.log(spItems);
          const itemsList: IBannerItem[] = spItems.Row.map((item) => {
            return {
              id: item.Id,
              title: item.Title,
              path: item.Link ?? item.Link.Description,
              lead: item.Lead,
              tags: item.Tags ?? { Label: item.Tags.Label, TermID: item.Tags.TermID },
              category: item.CategoryName,
              image: Shared.getImageValue(item.ThumbnailImage),
              publishDate: Shared.getDateFromDisplayTemplate(item.PublicationDate),
              contentTypeName: item.ContentTypeName
            };
          });
          setBannerItems(itemsList);
        }
      })
      .catch((error) => {
        console.error(`Error retrieving items from HomepageHighlights:`, error);
      });

    /* sp.site.rootWeb
      .getList('/Lists/HighlightsManagement')
      .items.select('*')
      .expand('FieldValuesAsHtml')
      .orderBy('Order', true)
      .filter(
        `Order ne null and HighlightEndDate ge datetime'${dateISO}' and HighlightStartDate le datetime'${dateISO}'`
      )
      .get()
      .then((spItems) => {
        const itemsList: IBannerItem[] = spItems.map((spItem) => {
          return {
            id: spItem.Id,
            title: spItem.Title,
            path: spItem.Link ?? spItem.Link.Description,
            lead: spItem.Lead,
            tags: spItem.Tags ?? Shared.getMetadataValue(spItem.Tags),
            category: spItem.CategoryName,
            image:
              spItem.FieldValuesAsHtml.x005f_ThumbnailImage ??
              Shared.getImageValue(spItem.FieldValuesAsHtml.x005f_ThumbnailImage),
            publishDate: Shared.getDateFromDisplayTemplate(spItem.PublicationDate),
            contentTypeName: spItem.ContentTypeName
          };
        });
        setBannerItems(itemsList);
      })
      .catch((error) => {
        console.error(`Error retrieving items from list:`, error);
       }); */
  }, []);

  function Track(index: number): void {
    try {
      const item: IBannerItem = bannerItems[index];

      const input: ITrackModel = {
        PageTitle: item.title,
        PageUrl: item.path,
        Action: 11,
        Source: 1,
        Category: item.category,
        ContentTypeName: item.contentTypeName
      };

      
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Shared.sendWsRequest<ITrackModel, void>({
        wpContext: context.wpContext,
        method: 'TrackPage',
        service: 'TrackingService',
        wsMethod: 'POST',
        input
      });
    } catch (error) {
      console.error('Erro ao fazer o tracking', error);
    }
  }
  // tslint:disable-next-line: no-any
  const firstSwiperRef: any = useRef(undefined);
  // tslint:disable-next-line: no-any
  const secondSwiperRef: any = useRef(undefined); // Create a ref for the second swiper

  // tslint:disable-next-line: no-any
  function handleFirstSwiperSlideChange(swiper: any): void {
    if (secondSwiperRef.current) {
      // tslint:disable-next-line: no-any
      const activeSlideIndex: any = swiper.realIndex; // Get the active slide index of the first swiper

      secondSwiperRef.current.slideTo(activeSlideIndex); // Slide the second swiper to the corresponding active slide

      // Add the active class to the corresponding slide in the second swiper
      // tslint:disable-next-line: no-any
      const slideElements: any = secondSwiperRef.current.slides;
      slideElements.forEach((slide: any, index: any) => {
        slide.classList.toggle('swiper-slide-active', index === activeSlideIndex);
      });
    }
  }

  // tslint:disable-next-line: no-any
  function handleSecondSwiperSlideClick(swiper: any): void {
    if (firstSwiperRef.current) {
      // tslint:disable-next-line: no-any
      const activeSlideElement: any = swiper.clickedSlide; // Get the clicked slide element in the second swiper
      // tslint:disable-next-line: no-any
      const slideElements: any = Array.prototype.slice.call(activeSlideElement.parentNode.children); // Get all slide elements in the second swiper
      // tslint:disable-next-line: no-any
      const activeSlideIndex: any = slideElements.indexOf(activeSlideElement); // Calculate the clicked slide index

      // Ensure that the activeSlideIndex is a valid number
      if (activeSlideIndex >= 0 && activeSlideIndex < bannerItems.length) {
        firstSwiperRef.current.slideTo(activeSlideIndex); // Slide to the corresponding active slide in the first swiper

        // Add the active class to the clicked slide
        slideElements.forEach((slide: any, index: any) => {
          slide.classList.toggle('swiper-slide-active', index === activeSlideIndex);
        });
      }
    }
  }

  if (!bannerItems.length) {
    return <></>;
  }
  return (
    <div className='bannerHome'>
      <div className='bannerHome-container'>
        {bannerItems && bannerItems.length > 0 && (
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            loop={false}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            thumbs={{ swiper: secondSwiperRef.current }} // Pass the second swiper instance to the thumbs prop
            navigation={{
              nextEl: '.bannerHome-button-next',
              prevEl: '.bannerHome-button-prev'
            }}
            onRealIndexChange={(a) => {
              Track(a.realIndex);
            }}
            onResize={(x) => {
              setTimeout(() => x.update(), 100);
            }}
            onSlideChange={handleFirstSwiperSlideChange} // Add the onSlideChange event handler
            onSwiper={(swiper) => (firstSwiperRef.current = swiper)} // Assign the swiper instance to the ref
          >
            {bannerItems &&
              bannerItems.map((item, index) => (
                <SwiperSlide className='bannerHome-slide' key={String(index)}>
                  {item.image.src !== '' && (
                    <div className='homeBanner-image'>
                      <img src={item.image.src} alt={item.image.alt} />
                    </div>
                  )}
                  <div className='mask'></div>
                  <div className='slide-container'>
                    <div className='homeBanner-info'>
                      <a href={`${item.path}${urlCode}`}>
                        <h2 className='title'>{item.title}</h2>
                      </a>
                      <p className='description'>{item.lead}</p>
                      {/* <Tags tags={item.tags} /> */}
                      {item.tags.length !== 0 && (
                        <div className='tags'>
                          <i className='fa fa-tags'></i>
                          <div>
                            {item.tags.map((tag, tagsIndex) => (
                              <a
                                key={`_tag_${tagsIndex}`}
                                href={`/pesquisa/Paginas/default.aspx#TagsRefStr=${tag.Label}`}
                              >
                                <span>{tag.Label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <>
                        publishDate={item.publishDate}
                        shareLink={`${item.path}${sharedCode}`}
                        leftSide
                        darkMode
                      </>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}

        <div className='thumbs'>
          <Swiper
            loop={false}
            // onSwiper={(swiper) => (secondSwiperRef.current = swiper)}
            slidesPerView={3.5}
            slideToClickedSlide={true}
            allowSlidePrev={true} // Enable swiping to the previous slide even when all slides are visible
            allowSlideNext={true}
            onResize={(x) => {
              setTimeout(() => x.update(), 100);
            }}
            onSwiper={(swiper) => (secondSwiperRef.current = swiper)} // Assign the swiper instance to the ref
            onClick={handleSecondSwiperSlideClick} // Add the onClick event handler
            breakpoints={{
              1025: {
                slidesPerView: 3.3
              },
              1550: {
                slidesPerView: 3.4
              },
              1600: {
                slidesPerView: 3.5
              },
              1685: {
                slidesPerView: 4
              }
            }}
          >
            {bannerItems &&
              bannerItems.map((item, index) => (
                <SwiperSlide key={String(index)}>
                  <div></div>
                  <div></div>
                  <div className='info'>
                    <p className='date'>{Shared.formatDate(item.publishDate)}</p>
                    <p className='title'>{item.title}</p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className='buttons-banner'>
          <div className='bannerHome-button-prev'>
            <i className='fal fa-arrow-left'></i>
          </div>
          <div className='bannerHome-button-next'>
            <i className='fal fa-arrow-right'></i>
          </div>
        </div>
      </div>
    </div>
  );
};

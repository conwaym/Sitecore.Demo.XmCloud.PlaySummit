import { PreviewSearchActions } from '@sitecore-discover/widgets';
import { useEffect } from 'react';
import debounce from '../../helpers/Debounce';
import { Action } from '@sitecore-discover/react';
import { PreviewSearchWidgetProps } from '@sitecore-discover/react';
import Link from 'next/link';
import { getCategoryByUrlPath } from '../../helpers/CategoriesDataHelper';
import { getPublicAssetUrl } from '../../../src/helpers/PublicUrlHelper';

type Category = {
  id: string;
  in_content: string;
  text: string;
  url: string;
};

export interface TrendingCategoriesProps extends PreviewSearchWidgetProps {
  rfkId: string;
}

const TrendingCategories = ({
  loaded,
  loading,
  trendingCategories,
  dispatch,
}: TrendingCategoriesProps): JSX.Element => {
  const publicUrl = getPublicAssetUrl();

  const changeKeyphrase: (text: string) => void = debounce(
    (text) => {
      const changeKeyphraseAction: Action = {
        type: PreviewSearchActions.KEYPHRASE_CHANGED,
        payload: { keyphrase: text || '' },
      };
      dispatch(changeKeyphraseAction);
    },
    500,
    null
  );

  useEffect(() => {
    let hasData = false;
    if (!hasData) {
      changeKeyphrase;
    }
    return () => {
      hasData = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loaded && !loading ? (
    <ul>
      {trendingCategories?.map((category: Category) => {
        const categoryInformation = getCategoryByUrlPath(category.url);
        const image = categoryInformation?.image_url
          ? categoryInformation.image_url
          : `${publicUrl}/assets/img/shop/category-placeholder.png`;

        return (
          <li key={category.id}>
            <Link href={category.url}>
              <img src={image} alt={category.text} />
              <h4>{category.text}</h4>
            </Link>
          </li>
        );
      })}
    </ul>
  ) : null;
};

export default TrendingCategories;

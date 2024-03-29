import React, { useState } from 'react'
import { AllWpRecept, ReceptContent } from '../graphql/types/ReceptContentType'
import H2 from '../components/typography/h2/H2'
import styled from '@emotion/styled'
import ContentNavWrapper from '../components/navigation/contentNavWrapper/ContentNavWrapper'
import ContentNavItem from '../components/navigation/contentNavItem/ContentNavItem'
import DoLikeThis from '../components/doLikeThis/DoLikeThis'
import Ingredients from '../components/Ingredients/Ingredients'
import Fab from '../components/fab/Fab'
import Chip from '../components/chips/Chip'
import typography from '../lib/typography'
import InvisibleLink from '../components/Links/InvisibleLink'
import H3 from '../components/typography/h3/H3'
import Spoon from '../assets/spoon.svg'
import Glove from '../assets/glove.svg'
import Instagram from '../components/instagram/instagram'
import Footer from '../components/footer/Footer'
import RecipeCardHeader from '../components/header/RecipeCardHeader'
import RateRecipe from '../components/rateRecipe/RateRecipe'
import SimilarRecipes from '../components/similarRecipes/SimilarRecipes'
import colors from '../lib/colors'
import { getImage } from 'gatsby-plugin-image'
import toast, { Toaster } from 'react-hot-toast'
import Seo from 'gatsby-plugin-wpgraphql-seo'
import { useToggleRecipe, useIsRecipeSaved } from '../hooks/savedRecipeQueries'

const ChipArea = styled.div({
    display: 'flex',
    columnGap: '17.5px',
    flexWrap: 'wrap',
    margin: '32px 10px 0px 10px',
    rowGap: '10px',
    ['@media only screen and (min-width: 90ch)']: {
        margin: '32px 20px 0px 20px',
        gridColumn: '1 / -1',
    },
    ['@media only screen and (min-width: 170ch)']: {
        gridArea: '1 / 3 / 2 / 4',
    },
    '@media print': {
        display: 'none',
    },
})
const FabArea = styled.div({
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
    ['@media only screen and (min-width: 90ch)']: {
        gridArea: '1 / -1',
        display: 'grid',
        gridAutoFlow: 'column',
        gap: '2rem',
        justifySelf: 'end',
        marginRight: '20px',
    },

    ['@media only screen and (min-width: 170ch)']: {
        gridArea: '1 / 2 / 2 / 3',
        justifySelf: 'start',
    },

    '@media print': {
        display: 'none',
    },
})

const ContentArea = styled.div({
    ['@media only screen and (min-width: 90ch)']: {
        display: 'grid',
        maxWidth: '1360px',
        margin: '0px auto',
        gridTemplateColumns: 'repeat(2, 1fr)',
    },
    ['@media only screen and (min-width: 170ch)']: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        columnGap: '30px',
    },
})

const FabWrapper = styled.button({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: colors.white,
    border: 'none',
})

const FabText = styled.span({
    ...typography.badge,
    display: 'none',
    ['@media only screen and (min-width: 90ch)']: {
        display: 'block',
    },
})

const StyledH2 = styled(H2)({
    marginTop: '50px',
    textAlign: 'center',
    '@media print': {
        display: 'none',
    },
})

const StyledDoLikeThis = styled(DoLikeThis)(
    ({ activeNav }: { activeNav: ActiveNav }) => ({
        display: activeNav === 'detail' ? 'block' : 'none',
        ['@media only screen and (min-width: 90ch)']: {
            gridColumn: '1 / -1',
        },
        ['@media only screen and (min-width: 170ch)']: {
            display: 'block',
            margin: '0px',
            gridArea: '3 / 2 / 5 / 4',
            maxWidth: '70ch',
        },
    })
)
const StyledIngredients = styled(Ingredients)(
    ({ activeNav }: { activeNav: ActiveNav }) => ({
        display: activeNav === 'ingredienser' ? 'flex' : 'none',
        ['@media only screen and (min-width: 90ch)']: {
            gridColumn: '1 / -1',
        },
        ['@media only screen and (min-width: 170ch)']: {
            display: 'flex',
            margin: '0px',
            gridArea: '3 / 1 / 4 / 2',
        },
    })
)

const StyledContentNavWrapper = styled(ContentNavWrapper)({
    ['@media only screen and (min-width: 90ch)']: {
        gridColumn: '1 / -1',
    },
    ['@media only screen and (min-width: 170ch)']: {
        display: 'none',
    },
})

const StyledH3Recipe = styled(H3)({
    display: 'none',
    ['@media only screen and (min-width: 170ch)']: {
        display: 'flex',
        gridArea: '2 / 1 / 3 / 2',
        gap: '14px',
    },
})
const StyledH3DoLikeTHis = styled(H3)({
    display: 'none',
    ['@media only screen and (min-width: 170ch)']: {
        gridArea: '2 / 2 / 3 / 4',
        display: 'flex',
        gap: '14px',
    },
})

const StyledSpoon = styled(Spoon)({
    maxHeight: '31.5px',
    maxWidth: '33px',
})
const StyledGlove = styled(Glove)({
    maxHeight: '27px',
    maxWidth: '37px',
})

const IconSpan = styled.span({
    display: 'grid',
    placeItems: 'center',
    width: 'max-content',
})

const StyleRateRecipe = styled(RateRecipe)({
    padding: '20px 10px 0px 10px',
    ['@media only screen and (min-width: 90ch)']: {
        gridColumn: '1 / 2',
    },

    ['@media only screen and (min-width: 170ch)']: {
        gridColumn: '1 / 2',
    },
})

const StyledSimilarRecipes = styled(SimilarRecipes)({
    marginBottom: '50px',
    ['@media only screen and (min-width: 90ch)']: {
        marginBottom: '70px',
    },

    ['@media only screen and (min-width: 170ch)']: {
        marginBottom: '100px',
    },
})
type ActiveNav = 'ingredienser' | 'detail'
type Props = {
    pageContext: { allWpRecept: AllWpRecept; recept: ReceptContent }
}
const receptPost = ({ pageContext }: Props) => {
    const { allWpRecept, recept } = pageContext
    const images = recept?.singlePaketAfc?.images?.map(img => {
        return getImage(img.localFile.childImageSharp)
    })

    const toggleRecipe = useToggleRecipe()
    const isSaved = useIsRecipeSaved(recept.id)
    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation()
        e.preventDefault()
        toggleRecipe(recept.id)
    }

    const [activeNav, setActiveNav] = useState<ActiveNav>('ingredienser')
    return (
        <>
            <Seo post={recept} />
            <div>
                <RecipeCardHeader
                    rating={recept?.rating?.avgRating}
                    recipeId={recept.id}
                    svarighetsgrad={recept.singlePaketAfc.svarighetsgrad}
                    tid={recept.singlePaketAfc.tid}
                    tidFormat={recept.singlePaketAfc.tidFormat}
                    kortBeskrivning={recept.singlePaketAfc.kortBeskrivning}
                    title={recept.title}
                    images={images}
                    style={{
                        maxWidth: '1360px',
                        margin: '0px auto',
                    }}
                />

                {/* Betygsätt */}
                <ContentArea>
                    <StyleRateRecipe pageContext={recept} />
                    <StyledContentNavWrapper>
                        <ContentNavItem
                            text={'Ingredienser'}
                            onClick={() => setActiveNav('ingredienser')}
                            active={activeNav === 'ingredienser'}
                        />
                        <ContentNavItem
                            text={'Gör såhär'}
                            onClick={() => setActiveNav('detail')}
                            active={activeNav === 'detail'}
                        />
                    </StyledContentNavWrapper>
                    <StyledH3Recipe>
                        <IconSpan>
                            <StyledSpoon />
                        </IconSpan>
                        Ingredienser
                    </StyledH3Recipe>
                    <StyledIngredients
                        activeNav={activeNav}
                        content={recept.content}
                    />
                    <StyledH3DoLikeTHis>
                        <IconSpan>
                            <StyledGlove />
                        </IconSpan>
                        Gör så här
                    </StyledH3DoLikeTHis>
                    <StyledDoLikeThis
                        activeNav={activeNav}
                        saHarGorDu={recept.singlePaketAfc.saHarGorDu}
                    />
                    <ChipArea>
                        {recept.tags.nodes.map(tag => (
                            <InvisibleLink
                                key={tag.name}
                                to={`/recept?q=${tag.name}`}
                            >
                                <Chip key={tag.name} text={tag.name} />
                            </InvisibleLink>
                        ))}
                    </ChipArea>
                    <FabArea>
                        <FabWrapper onClick={e => handleClick(e)}>
                            {isSaved ? (
                                <Fab variant={'saved'} />
                            ) : (
                                <Fab variant={'save'} />
                            )}
                            <FabText>Spara</FabText>
                        </FabWrapper>
                        <FabWrapper
                            onClick={() => {
                                // save url to clipboard
                                navigator.clipboard
                                    .writeText(window.location.href)
                                    .then(() => {
                                        toast.success(
                                            'Länken har sparats till urklipp'
                                        )
                                    })
                            }}
                        >
                            <Fab variant={'share'} />
                            <FabText>Dela</FabText>
                        </FabWrapper>
                        <FabWrapper onClick={() => window.print()}>
                            <Fab variant={'print'} />
                            <FabText>Skriv ut</FabText>
                        </FabWrapper>
                    </FabArea>
                </ContentArea>

                <div
                    style={{
                        width: '100%',
                        display: 'grid',
                        justifyContent: 'center',
                    }}
                >
                    <StyledH2>Du kanske också gillar...</StyledH2>
                    <StyledSimilarRecipes
                        tags={recept.tags.nodes.map(tag => tag.name)}
                        show={4}
                        allWpRecept={allWpRecept.filter(
                            wpRecept => wpRecept.id !== recept.id
                        )}
                    />
                </div>
                <Instagram />
                <Footer />
                <Toaster />
            </div>
        </>
    )
}

export default receptPost
